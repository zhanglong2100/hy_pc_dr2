import {STATUS} from '../http-status-codes';
import {InMemoryConfig, RequestInfo, ResponseOptions} from '../interfaces';
import {Injectable} from '@angular/core';
import {HttpRequest} from '@angular/common/http';
import {HttpClientInterceptor} from './http-client-interceptor';
import {InMemoryUtil} from './in-memory-util';
import {InMemoryBaseConfig} from './in-memory-base-config.service';

/**
 * Interface for a class that creates an in-memory database
 *
 * Its `createDb` method creates a hash of named collections that represents the database
 *
 * For maximum flexibility, the service may define HTTP method overrides.
 * Such methods must match the spelling of an HTTP method in lower case (e.g, "get").
 * If a request has a matching method, it will be called as in
 * `get(info: requestInfo, db: {})` where `db` is the database object described above.
 */
@Injectable()
export abstract class InMemoryDbService {

    private httpClientInterceptor: HttpClientInterceptor;
    private inMemoryUtil: InMemoryUtil;
    private _config: InMemoryConfig = new InMemoryBaseConfig();

    protected db: { [key: string]: any[]; };
    protected dbKeys: { [key: string]: string[]; };

    constructor() {
        this.db = this.createDb();
        this.dbKeys = this.getDbKeys();
    }

    setHttpClientInterceptor(a: HttpClientInterceptor) {
        this.httpClientInterceptor = a;
    }

    setInMemoryUtil(util: InMemoryUtil) {
        this.inMemoryUtil = util;
    }

    protected _getCollection(collectionName: string) {
        return this.db[collectionName];
    }

    /**
     * 创建数据库
     */
    abstract createDb(reqInfo?: RequestInfo): { [key: string]: any[]; };

    /**
     * 获取数据库对应的主键
     */
    abstract getDbKeys(): { [key: string]: string[]; };

    abstract support(req: HttpRequest<any>): boolean;

    /**
     * 生成Id，如果inMemDbService中存在genId方法则使用
     * 否则使用genGuid的方法
     * @param collectionName 分类名称
     * @param item 元素
     */
    protected genId<T>(collectionName: string, item: T): any {
        return this.genGuid();
    }

    /**
     * 提交数据
     * @param collection 分类数据
     * @param collectionName 分类名称
     * @param headers 头文件
     * @param keys 主键
     * @param req 请求
     * @param resourceUrl url
     * @param url url
     */
    protected _commit({collectionName, headers, req, resourceUrl, url}: RequestInfo): ResponseOptions {
        const item = JSON.parse(JSON.stringify(req.body));
        const dbKeys = this.dbKeys[collectionName];
        const keys2 = [];
        for (const dbKey of dbKeys) {
            if (!item[dbKey]) {
                try {
                    item[dbKey] = this.genId(collectionName, item);
                } catch (err) {
                    console.error(err);
                    return this.inMemoryUtil.createErrorResponseOptions(url, STATUS.INTERNAL_SERVER_ERROR,
                        `Failed to generate new ${dbKey} for '${collectionName}'`);
                }
            }
            keys2.push(item[dbKey]);
        }
        const collection = this.db[collectionName];
        const existingIndex = this._indexOf(collection, collectionName, keys2);
        const body = this.httpClientInterceptor.bodify(item, this.config);

        if (existingIndex === -1) {
            collection.push(item);
            return {headers, body, status: STATUS.OK};
        } else {
            collection[existingIndex] = item;
            return {headers, body, status: STATUS.OK}; // successful; return entity
        }
    }

    /**
     * 根据数据查找标识
     * @param collection 分类数据
     * @param collectionName 分类名称
     * @param keys 标识
     */
    protected _indexOf(collection: any[], collectionName: string, keys: any[]) {
        const dbKeys: Array<string> = this.dbKeys[collectionName];
        if (dbKeys.length !== keys.length) {
            return -1;
        }
        return collection.findIndex((item: any) => {
            for (let i = 0; i < dbKeys.length; i++) {
                if (keys[i] !== item[dbKeys[i]]) {
                    return false;
                }
            }
            return true;
        });
    }

    /**
     * 生成guid
     */
    protected genGuid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + s4() + s4() +
            s4() + s4() + s4() + s4();
    }

    /**
     * get 方法
     * @param collection 分类数据
     * @param collectionName 分类名称
     * @param headers 请求头
     * @param keys 主键标识
     * @param query 查询
     * @param url url对象
     */
    protected _get({collectionName, headers, query, url}: RequestInfo): ResponseOptions {
        let data = this.db[collectionName];
        if (query) {
            data = this._applyQuery(data, query);
        }

        if (!data) {
            return this.inMemoryUtil.createErrorResponseOptions(
                url, STATUS.NOT_FOUND, `'${collectionName}' 查找异常！`);
        }
        return {
            body: this.httpClientInterceptor.bodify(this.clone(data), this.config),
            headers: headers,
            status: STATUS.OK
        };
    }

    /**
     * 按 keys 进行删除
     * @param collection 分类数据
     * @param collectionName 分类名称
     * @param keys 主键
     */
    protected _removeByKeys(collection: any[], collectionName: string, keys: any[]): boolean {
        const ix = this._indexOf(collection, collectionName, keys);
        if (ix > -1) {
            collection.splice(ix, 1);
            return true;
        }
        return false;
    }

    /**
     * 根据主键数据获取 对象
     * @param collection 分类数据
     * @param collectionName 分类名称
     * @param keys 主键数据
     */
    protected _findByKeys<T>(collection: T[], collectionName: string, keys: any[]): T {
        if (typeof keys === 'string') {
            keys = [keys];
        }
        const index = this._indexOf(collection, collectionName, keys);
        if (index > -1) {
            return collection[index];
        } else {
            return null;
        }
    }


    /**
     * Apply query/search parameters as a filter over the collection
     * This impl only supports RegExp queries on string properties of the collection
     * ANDs the conditions together
     */
    protected _applyQuery(collection: any[], query: { [p: string]: string[] }): any[] {
        // extract filtering conditions - {propertyName, RegExps) - from query/search parameters
        const conditions: { name: string, rx: RegExp }[] = [];
        const caseSensitive = this.config.caseSensitiveSearch ? undefined : 'i';
        for (const name in query) {
            const queryItem: string[] = query[name];
            for (const r of queryItem) {
                conditions.push({name, rx: new RegExp(decodeURI(r), caseSensitive)});
            }
        }
        const len = conditions.length;
        if (!len) {
            return collection;
        }

        // AND the RegExp conditions
        return collection.filter(row => {
            let ok = true;
            let i = len;
            while (ok && i) {
                i -= 1;
                const cond = conditions[i];
                ok = cond.rx.test(row[cond.name]);
            }
            return ok;
        });
    }

    clone(data: any) {
        return JSON.parse(JSON.stringify(data));
    }

    get config() {
        return this._config;
    }

    set config(config: InMemoryConfig) {
        this._config = config;
    }
}

export type InMemoryDbServices = InMemoryDbService[] ;

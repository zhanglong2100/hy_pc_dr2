import {HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Page} from '@sb/base';
import {InMemoryConfig} from '../interfaces';
import {InMemoryDbService} from './in-memory-db-service';
import {RequestInfo} from '../interfaces/request-info';

export abstract class BaseInMemoryService<F, S extends Page> extends InMemoryDbService {
    abstract get moduleName(): string;

    abstract get keyFields(): string[];

    abstract get searchFields(): string[];

    abstract get dbArrays(): F[];

    createDb(reqInfo?: RequestInfo) {
        const o = {};
        o[this.moduleName] = this.dbArrays;
        return o;
    }

    getDbKeys(): { [p: string]: string[] } {

        const o = {};
        o[this.moduleName] = this.keyFields;
        return o;
    }


    support(request: HttpRequest<any>): boolean {
        const config: InMemoryConfig = this.config;
        return request.url.startsWith(config.rootPath + this.moduleName);
    }

    /**
     * 覆盖 get 方法
     * @param requestInfo RequestInfo 对象
     */
    get(requestInfo: RequestInfo): object | Observable<Response> {
        const collection = this._getCollection(requestInfo.collectionName);
        let searchObj = requestInfo.req.body;
        if (searchObj && searchObj.id) {
            searchObj = {
                id: [searchObj.id]
            };
        }
        return searchObj === null ? collection : this._applyQuery(collection, searchObj);
    }

    /**
     * list 方法
     * @param requestInfo RequestInfo 对象
     */
    list(requestInfo: RequestInfo): object | Observable<Response> {
        const collection = this._getCollection(requestInfo.collectionName);
        const searchObj = requestInfo.req.body as S;
        if (searchObj) {
            let data = collection;
            if (this.searchFields) {
                const obj = {};
                for (const one of this.searchFields) {
                    if (searchObj[one]) {
                        obj[one] = [searchObj[one]];
                    }
                }
                data = this._applyQuery(collection, obj);
            }
            const len = data.length;
            if (searchObj.rows && searchObj.page) {
                data = data.slice((searchObj.page - 1) * searchObj.rows, searchObj.page * searchObj.rows);
                return {
                    rows: data,
                    total: len
                };
            } else {
                return data;
            }
        }
    }


    /**
     * 删除方法
     * @param requestInfo RequestInfo 对象
     */
    remove(requestInfo: RequestInfo): any {
        const collection = this._getCollection(requestInfo.collectionName);
        const collectionName = requestInfo.collectionName;
        const searchObj = requestInfo.req.body;
        for (const serverId of searchObj.keyIds) {
            this._removeByKeys(collection, collectionName, [serverId]);
        }
        return true;
    }

    /**
     * 排序方法
     * @param requestInfo RequestInfo 对象
     */
    updateOrder(requestInfo: RequestInfo): any {
        return true;
    }

    /**
     * 提交
     * @param requestInfo RequestInfo 对象
     */
    commit(requestInfo: RequestInfo): object | Observable<Response> {
        const body = requestInfo.req.body;
        return super._commit(requestInfo);
    }

}

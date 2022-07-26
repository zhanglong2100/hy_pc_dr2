import {Observable} from 'rxjs';

import {STATUS} from '../http-status-codes';

import {
    CONFIGS_INTERCEPTORS,
    IN_MEMORY_DB_SERVICES_INTERCEPTORS,
    InMemoryConfig,
    ParsedRequestUrl,
    parseUri,
    RequestInfo,
    ResponseOptions,
    UriInfo
} from '../interfaces';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest} from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import {InMemoryDbService, InMemoryDbServices} from './in-memory-db-service';
import {InMemoryUtil} from './in-memory-util';
import {ReturnForm} from '@sb/base';

/**
 * Base class for in-memory web api back-ends
 * Simulate the behavior of a RESTy web api
 * backed by the simple in-memory data store provided by the injected `InMemoryDbService` service.
 * Conforms mostly to behavior described here:
 * http://www.restapitutorial.com/lessons/httpmethods.html
 */
@Injectable()
export class HttpClientInterceptor implements HttpInterceptor {
    private inMems: InMemoryDbServices;
    private configs: InMemoryConfig[];
    private inMemoryUtil: InMemoryUtil;

    constructor(private injector: Injector) {
        this.inMems = this.injector.get(IN_MEMORY_DB_SERVICES_INTERCEPTORS, []);
        this.configs = this.injector.get(CONFIGS_INTERCEPTORS, []);
        this.inMemoryUtil = this.injector.get(InMemoryUtil);
        // Object.assign(this.config, config);
        this.inMems.forEach((inMem, index, array) => {
            inMem.setHttpClientInterceptor(this);
            inMem.setInMemoryUtil(this.inMemoryUtil);
            inMem.config = this.configs[index];
        });
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        for (let i = 0; i < this.inMems.length; i++) {
            if (this.inMems[i].support(req)) {
                return this.handle(req, this.inMems[i]);
            }
        }
        return next.handle(req);
    }

    /**
     * 处理request请求
     * @param req httpRequest
     * @param inMem db对象
     */
    handle(req: HttpRequest<any>, inMem: InMemoryDbService): Observable<HttpEvent<any>> {
        try {
            return this.handleRequest(req, inMem);
        } catch (error) {
            const err = error.message || error;
            const resOptions = this.inMemoryUtil.createErrorResponseOptions(req.url, STATUS.INTERNAL_SERVER_ERROR, `${err}`);
            return this.inMemoryUtil.createResponse$(() => resOptions, inMem.config.delay);
        }
    }

    handleRequest(req: HttpRequest<any>, inMemDbService: InMemoryDbService): Observable<any> {
        const url = req.urlWithParams ? req.urlWithParams : req.url;

        // Try override parser
        // If no override parser or it returns nothing, use default parser
        const parsed: ParsedRequestUrl = this.parseRequestUrl(url, inMemDbService.config);

        const collectionName = parsed.collectionName;

        const reqInfo: RequestInfo = {
            req: req,
            collectionName: collectionName,
            headers: this.createHeaders({'Content-Type': 'application/json'}),
            fcName: parsed.fcName,
            query: parsed.query,
            resourceUrl: parsed.resourceUrl,
            url: url
        };

        // 直接按每个分类查看是否匹配Url
        // 调用方法反回是否支持
        // 获取service下对应的方法
        const methodInterceptor = this.bind(inMemDbService, reqInfo.fcName);
        if (!methodInterceptor) {
            this.inMemoryUtil.createResponse$(() => {
                return this.inMemoryUtil.createErrorResponseOptions(reqInfo.url, STATUS.NOT_FOUND, '找不到' + reqInfo.fcName + '方法');
            });
        }
        // 获取请求结果
        const methodResult = methodInterceptor(reqInfo);
        if (methodResult instanceof Observable) {
            return methodResult;
        } else {
            return this.inMemoryUtil.createResponse$(() => {
                let q: ResponseOptions = methodResult;
                if (!(methodResult.body && methodResult.headers && methodResult.status)) {
                    q = {
                        body: this.bodify(this.clone(methodResult), inMemDbService.config),
                        headers: reqInfo.headers,
                        status: STATUS.OK
                    };
                }
                const re = this.bind(inMemDbService, 'responseInterceptor');
                if (!re) {
                    // re = this.responseInterceptor;
                    return q;
                }
                return re(q, reqInfo);
            });
        }
    }

    bodify(data: any, config: InMemoryConfig) {
        return config.dataEncapsulation ? {data} : data;
    }

    clone(data: any) {
        return JSON.parse(JSON.stringify(data));
    }


    /**
     * Create standard HTTP headers object from hash map of header strings
     * @param headers 请求头
     */
    createHeaders(headers: { [index: string]: string; }): HttpHeaders {
        return new HttpHeaders(headers);
    }


    /**
     * 获取地址
     *
     * Get location info from a url, even on server where `document` is not defined
     */
    getLocation(url: string): UriInfo {
        if (!url.startsWith('http')) {
            // get the document iff running in browser
            const doc: Document = (typeof document === 'undefined') ? undefined : document;
            // add host info to url before parsing.  Use a fake host when not in browser.
            const base = doc ? doc.location.protocol + '//' + doc.location.host : 'http://fake';
            url = url.startsWith('/') ? base + url : base + '/' + url;
        }
        return parseUri(url);
    }

    /**
     * 获取请求方法
     * @param req - request
     */
    getRequestMethod(req: any): string {
        return (req.method || 'get').toLowerCase();
    }

    /**
     * 解析Url
     */
    parseRequestUrl(url: string, config: InMemoryConfig): ParsedRequestUrl {
        try {
            let drop = 0;
            if (url.startsWith(config.rootPath)) {
                drop = config.rootPath.length;
            }
            const path = url.substring(drop);

            const pathSegments = path.split('/');
            let segmentIx = 0;

            let collectionName = pathSegments[segmentIx++];
            // ignore anything after a '.' (e.g.,the "json" in "customers.json")
            collectionName = collectionName && collectionName.split('.')[0];

            const fcName = pathSegments[segmentIx++];
            const loc = parseUri(url);
            const query = this.createQueryMap(loc.query);
            return {collectionName, fcName, query, resourceUrl: url};
        } catch (err) {
            const msg = `unable to parse url '${url}'; original error: ${err.message}`;
            throw new Error(msg);
        }
    }

    /**
     * return a search map from a location query/search string
     */
    createQueryMap(search: string): { [p: string]: string[] } {
        const map2: { [p: string]: string[] } = {};
        if (search) {
            const params = new HttpParams({fromString: search});
            const re = params.keys();
            for (let i = 0; i < re.length; i++) {
                const key = re[i];
                map2[key] = params.getAll(key);
            }
        }
        return map2;
    }

    /**
     * 拦截返回的数据
     * @param res ResponseOptions对象
     * @param ri RequestInfo对象
     */
    responseInterceptor(res: ResponseOptions, ri: RequestInfo): ResponseOptions {
        if (res.status === 200) {
            const returnForm: ReturnForm<any> = {
                success: true,
                message: res.body,
                status: 200
            };
            res.body = returnForm;
        }
        return res;
    }

    protected bind<T extends Function>(inMemDbService: InMemoryDbService, methodName: string) {
        const fn = inMemDbService[methodName] as T;
        return fn ? <T>fn.bind(inMemDbService) : undefined;
    }

    /**
     * 重置数据库
     * returns Observable of the database because resetting it could be async
     */
    resetDb(reqInfo?: RequestInfo, inMemDbService?: InMemoryDbService): any {
        const db = inMemDbService.createDb(reqInfo);
        // const db$ = db instanceof Observable ? db :
        //     typeof (db as any).then === 'function' ? from(db as Promise<any>) : of(db);
        // db$.pipe(first()).subscribe((d: {}) => {
        //     this.dbReadySubject.next(true);
        // });
        // return this.dbReady;
    }

}

import {HttpHeaders, HttpRequest} from '@angular/common/http';

/**
 * Interface for object w/ info about the current request url
 * extracted from an Http Request.
 * Also holds utility methods and configuration data from this service
 */
export interface RequestInfo {
    req: HttpRequest<any>;
    /**
     * 指定数据
     */
    collectionName: string;
    /**
     * 返回的头
     */
    headers: HttpHeaders;
    /**
     * 请求的方法名称
     */
    fcName?: string;
    /**
     * 查询方式
     */
    query: { [p: string]: string[] };
    resourceUrl: string;
    url: string; // request URL
}

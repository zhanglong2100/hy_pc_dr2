/**
 *
 * Interface for the result of the `parseRequestUrl` method:
 *   Given URL "http://localhost:8080/api/customers/42?foo=1 the default implementation returns
 *     base: 'api/'
 *     collectionName: 'customers'
 *     query: this.createQuery('foo=1')
 *     resourceUrl: 'http://localhost/api/customers/'
 */
export interface ParsedRequestUrl {
    collectionName: string; // the name of the collection of data items (e.g.,`customers`)
    query: { [p: string]: string[] }; // the query parameters;
    resourceUrl: string;    // the effective URL for the resource (e.g., 'http://localhost/api/customers/')
    /**
     * 请求的方法名称
     */
    fcName: string;
}

export function parseUri(str: string): UriInfo {
    // Adapted from parseuri package - http://blog.stevenlevithan.com/archives/parseuri
    // tslint:disable-next-line:max-line-length
    const URL_REGEX = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
    const m = URL_REGEX.exec(str);
    const uri: UriInfo = {
        source: '',
        protocol: '',
        authority: '',
        userInfo: '',
        user: '',
        password: '',
        host: '',
        port: '',
        relative: '',
        path: '',
        directory: '',
        file: '',
        query: '',
        anchor: ''
    };
    const keys = Object.keys(uri);
    let i = keys.length;

    while (i--) {
        uri[keys[i]] = m[i] || '';
    }
    return uri;
}

/** Interface of information about a Uri  */
export interface UriInfo {
    source: string;
    protocol: string;
    authority: string;
    userInfo: string;
    user: string;
    password: string;
    host: string;
    port: string;
    relative: string;
    path: string;
    directory: string;
    file: string;
    query: string;
    anchor: string;
}

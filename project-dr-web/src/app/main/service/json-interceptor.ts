import {Observable} from 'rxjs';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';

@Injectable()
export class JsonInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.isWrapper(req, next)) {

            let newParam: HttpParams = new HttpParams({
                encoder: {
                    encodeKey: (key: string) => {
                        return encodeURIComponent(key);
                    },
                    encodeValue: (value: string) => {
                        return encodeURIComponent(value);
                    },
                    decodeKey: (key: string) => {
                        return decodeURIComponent(key);
                    },
                    decodeValue: (value: string) => {
                        return decodeURIComponent(value);
                    }
                }
            });

            newParam = this.changeObjToHttpParams(req.body, newParam);

            let headers = req.headers;
            if (!headers.get('Content-Type')) {
                headers = headers.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            }
            req = req.clone({
                // responseType: 'text',
                headers: headers,
                body: newParam.toString(),
            });

            return next.handle(req).pipe(
                map((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        if (typeof event.body === 'string') {
                            try {
                                return event.clone({body: JSON.parse(event.body)});
                            } catch (e) {
                                console.log(event.body);
                                console.error(e);
                            }
                        }
                    }
                    return event;
                })
            );
        } else {
            return next.handle(req);
        }
    }

    private changeObjToHttpParams(obj: any, newParam: HttpParams, prefix = ''): HttpParams {
        if (prefix.startsWith('_')) {
            return newParam;
        }
        if (obj instanceof Array) {
            for (let i = 0; i < obj.length; i++) {
                newParam = this.changeObjToHttpParams(obj[i], newParam, prefix);
            }
        } else if (typeof obj === 'object') {
            // 添加object参数
            for (const name in obj) {
                const v = obj[name];
                newParam = this.changeObjToHttpParams(v, newParam, (prefix === '' ? '' : (prefix + '.')) + name);
            }
        } else if (typeof obj === 'number' || typeof obj === 'boolean') {
            newParam = newParam.append(prefix, '' + obj);
        } else if (typeof obj === 'string') {
            newParam = newParam.append(prefix, '' + obj);
        }
        return newParam;
    }

    private isWrapper(req: HttpRequest<any>, next: HttpHandler) {
        let headers = req.headers;
        let contentType = headers.get('Content-Type');
        return req.method === 'POST'
            && req.responseType === 'json'
            && typeof req.body === 'object'
            && (!(req.body instanceof FormData))
            && (!contentType || contentType.startsWith("application/x-www-form-urlencoded"));
    }

}

import {Observable} from 'rxjs';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {ReturnForm} from '@sb/base';

@Injectable()
export class ReturnFormInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(map<HttpResponse<any>, HttpResponse<ReturnForm<any>>>(res => {
            if (res.status === 200) {
                let body = res.body;
                if(!body){
                    return res;
                }
                // if (body === false) {
                //     body = {
                //         success: false,
                //         errorMessage: '测试返回错误！',
                //         status: 500
                //     } as ReturnForm<any>;
                // }
                if (body.success === undefined && body.message === undefined) {
                    body = {
                        success: true,
                        message: res.body,
                        status: 200
                    };
                }
                return new HttpResponse<ReturnForm<any>>({
                    body: body,
                    headers: res.headers,
                    status: res.status,
                    statusText: res.statusText,
                    url: res.url
                });
            }
            return res;
        }));
    }

}

import {Observable} from 'rxjs';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {baseHandleError, ReturnForm} from '@sb/base';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<ReturnForm<any>>, next: HttpHandler): Observable<HttpEvent<ReturnForm<any>>> {
        return next.handle(req).pipe(
            map<HttpResponse<any>, HttpResponse<any>>(
                res => {
                    const returnForm: ReturnForm<any> = res.body;
                    return res;
                }
            ),
            catchError(baseHandleError<any>('none'))
        );
    }


}

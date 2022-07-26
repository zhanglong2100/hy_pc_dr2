import {Observable} from 'rxjs';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../environments/environment.hmr';

@Injectable()
export class LoginInterceptor implements HttpInterceptor {

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router) {
    }


    /**
     * 如果 status 是 -1 时 进行例如界面
     * @param req HttpRequest对象
     * @param next HttpHandler对象
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(map<HttpResponse<any>, HttpResponse<any>>(res => {
            if (res && res.status === 200) {
                const body = res.body;
                if (body != null
                    && typeof body === 'object'
                    && req.url !== environment.baseServerUrl + 'sso/login'
                    && body.success === false
                    && body.status === -999) {
                    if (!this.router.url.startsWith("/login")) {
                        this.router.navigate(['./', {
                            outlets: {popup: 'popupLogin'}
                        }], {
                            relativeTo: this.activatedRoute
                        });
                    }
                } else {
                    return res;
                }
            } else {
                return res;
            }
        }));
    }

}

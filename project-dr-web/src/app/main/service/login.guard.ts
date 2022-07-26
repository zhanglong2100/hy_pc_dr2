import {Injectable} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    CanLoad,
    Route,
    Router,
    RouterStateSnapshot,
    UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {MainService} from './main.service';
import {map} from 'rxjs/operators';
import {ReturnForm} from '@sb/base';

@Injectable()
export class LoginGuard implements CanActivate, CanLoad, CanActivateChild {
    constructor(private mainService: MainService,
                private router: Router) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.checkLogin(state.url);
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.checkLogin(state.url);
    }

    canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
        return this.checkLogin();
    }

    private checkLogin(loginFor?: string): Observable<boolean> {
        return this.mainService.checkLogin().pipe(map<ReturnForm<any>, boolean>((returnForm, index) => {
            if (returnForm && returnForm.success) {
                return true;
            } else {
                this.router.navigate(['/login'], {
                    queryParams: {loginFor: loginFor || this.router.url},
                    replaceUrl: false
                });
                return false;
            }
        }));
    }

    private checkPermission(): Observable<boolean> {
        return undefined;
    }


}

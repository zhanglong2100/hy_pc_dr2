import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {BASE_HTTP_OPTIONS, baseHandleError, ReturnForm} from '@sb/base';
import {ShowMenus} from '../entity/show-menu';
import {Route, Router, Routes} from '@angular/router';
import {Error404Component} from '../error404/error404.component';
import {LoginGuard} from './login.guard';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    private menuUrl = environment.baseServerUrl + 'menu';

    private cacheResult: string = null;
    private cacheRoutes: Routes = null;

    constructor(private http: HttpClient,
                private router: Router) {
    }

    /**
     * 尝试登录
     */
    getShowMenu(): Observable<ReturnForm<ShowMenus>> {
        return new Observable<ReturnForm<ShowMenus>>(
            (subscriber): void => {
                if (this.cacheResult) {
                    subscriber.next(JSON.parse(this.cacheResult));
                    subscriber.complete();
                } else {
                    this.http.post<ReturnForm<ShowMenus>>(`${this.menuUrl}/getShowMenu`, null, BASE_HTTP_OPTIONS)
                        .pipe(
                            catchError(baseHandleError<ReturnForm<ShowMenus>>('getShowMenu'))
                        ).subscribe(returnForm => {
                        if (returnForm.success) {
                            let menus = returnForm.message;

                            this.cacheResult = JSON.stringify(returnForm);

                            // 设置路由
                            let routes = this.getRoutes(menus);
                            this.cacheRoutes = routes;

                            const oldRouter = this.router.config;
                            oldRouter[0].children = routes;
                            const route: Route = oldRouter[oldRouter.length - 1];
                            route.component = Error404Component;
                            const url = this.router.url;
                            this.router.resetConfig(oldRouter);

                            this.router.navigateByUrl(url);


                            subscriber.next(returnForm);
                            subscriber.complete();
                        }
                    })
                }
            });
    }

    private getRoutes(menus: ShowMenus): Routes {
        if (!menus) {
            return [];
        }
        const routes: Routes = []; // 测试嵌套路由
        for (let i = 0; i < menus.length; i++) {
            const menu = menus[i];
            if (!menu) {
                continue;
            }
            let data = menu.data;
            if (menu.urlType === 'ABSOLUTE') {
                let exist = false;
                for (let i = 0; i < this.router.config.length; i++) {
                    const c = this.router.config[i];
                    exist = c.path === menu.code;
                }
                if (!exist) {
                    let route = {
                        path: menu.code,
                        loadChildren: 'src/app/main/redirect/redirect.module#RedirectModule',
                        data: {breadcrumb: menu.name, link: menu.loadChildren},
                        canLoad: [LoginGuard]
                    };
                    if (menu.data.openType === 'OPEN') {
                        this.router.config.splice(1, 0, route);
                    } else {
                        routes.push(route);
                    }
                }
            } else {
                if (menu.data.openType === 'OPEN') {
                    this.router.config = this.router.config.filter(v => v.path !== menu.code);
                    this.router.config.splice(1, 0, {
                        path: menu.code,
                        loadChildren: menu.loadChildren,
                        data: {breadcrumb: menu.name},
                        canLoad: [LoginGuard],
                    });
                } else {
                    if (menu.loadChildren) {
                        routes.push({
                            path: menu.code,
                            loadChildren: menu.loadChildren,
                            data: {breadcrumb: menu.name},
                            canLoad: [LoginGuard],
                        });
                    } else if (menu.children && menu.children.length > 0) {
                        routes.push({
                            path: menu.code,
                            children: this.getRoutes(menu.children),
                            data: {breadcrumb: menu.name},
                            canActivate: [LoginGuard],
                        });
                    }
                }
            }
        }
        if (routes.length > 0) {
            routes.splice(0, 0, {path: '', redirectTo: routes[0].path, pathMatch: 'full'});
        }
        routes.push({path: '**', component: Error404Component});
        return routes;
    }

    /**
     * 更新菜单
     * @param menus 显示菜单
     * @param parentPath 路由路径（相对于index）
     */
    updateMenus(menus: ShowMenus, parentPath = '') {
        for (let i = 0; i < menus.length; i++) {
            const menu = menus[i];
            if (!menu) {
                continue;
            }
            let exist = false;
            for (let i = 0; i < this.router.config.length; i++) {
                const c = this.router.config[i];
                exist = c.path === menu.code;
            }
            if (!exist) {
                if (menu.urlType === 'ABSOLUTE') {
                    let routerLink;
                    if (menu.data.openType === 'OPEN') {
                        routerLink = '/' + menu.code;
                    } else {
                        routerLink = parentPath + '/' + menu.code;
                    }
                    menu.routerLink = routerLink;
                    menu.loadChildren = 'src/app/main/redirect/redirect.module#RedirectModule';
                } else {
                    let tempParentPath = parentPath;
                    if (menu.data.openType === 'OPEN') {
                        tempParentPath = '';
                    }
                    menu.routerLink = tempParentPath + '/' + menu.code;
                    if (menu.loadChildren) {
                        if (menu.children && menu.children.length > 0) {
                            const arr = [];
                            for (const subMenu of menu.children) {
                                arr.push({
                                    name: subMenu.name,
                                    code: menu.code + '/' + subMenu.code,
                                    routerLink: menu.routerLink + '/' + subMenu.code
                                });
                            }
                            menus.splice(i, 1, ...arr);
                            i += arr.length - 1;
                        }
                    } else if (menu.children && menu.children.length > 0) {
                        this.updateMenus(menu.children, menu.routerLink);
                    }
                }
            }
        }
    }

    clearCache() {
        this.cacheResult = null;
        this.cacheRoutes = null;
    }
}

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LoginComponent} from './login/login.component';
import {IndexComponent} from './index/index.component';
import {PopupLoginComponent} from './popup-login/popup-login.component';
import {CreateAdminComponent} from './create-admin/create-admin.component';
import {LoadingComponent} from './loading/loading.component';
import {Error404Component} from './error404/error404.component';
import {RegisterComponent} from './register/register.component';
import {UnauthorizedComponent} from "./unauthorized/unauthorized.component";
import {LoginGuard} from "./service/login.guard";
import {NavigationComponent} from "./navigation/navigation.component";


const routes: Routes = [
    {
        path: 'index', component: IndexComponent,
        children: [{
            path: '**',
            canActivate: [LoginGuard],
            component: Error404Component
        }]
    },
    {path: '', redirectTo: 'nav', pathMatch: 'full'}, // 默认路由(登录)
    {path: 'login', component: LoginComponent}, // 默认路由(登录)
    {path: 'register', component: RegisterComponent}, // 注册
    {path: 'createAdmin', component: CreateAdminComponent}, // 默认路由(登录)
    {path: 'popupLogin', component: PopupLoginComponent, outlet: 'popup'},
    {path: 'unauthorized', component: UnauthorizedComponent},
    {path: 'nav', component: NavigationComponent, canActivate: [LoginGuard]},
    {
        path: '**',
        component: LoadingComponent
    }
];


@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forRoot(routes, {
            useHash: true,
            relativeLinkResolution: 'corrected'
        })
    ],
    entryComponents: [
        Error404Component
    ]
    // providers: [
    //     {provide: RouteReuseStrategy, useClass: AppRoutingStrategy}
    // ]
})
export class AppRoutingModule {
}

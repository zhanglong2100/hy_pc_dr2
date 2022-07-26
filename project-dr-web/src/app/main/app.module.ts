import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import {registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';


import {LoginComponent} from './login/login.component';
import {IndexComponent} from './index/index.component';
import {MenuComponent} from './menu/menu.component';
import {BreadcrumbComponent} from './breadcrumb/breadcrumb.component';
import {FirstLevelMenuComponent} from './first-level-menu/first-level-menu.component';
import {Error404Component} from './error404/error404.component';
import {PopupLoginComponent} from './popup-login/popup-login.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {environment} from '../../environments/environment';
import {InMemorySsoService} from './service/in-memory-sso.service';
import {CreateAdminComponent} from './create-admin/create-admin.component';
import {JsonInterceptor} from './service/json-interceptor';
import {InMemoryHttpClientModule} from '@sb/in-memory-http-client';
import {LoginInterceptor} from './service/login-interceptor';
import {LoginGuard} from './service/login.guard';
import {AppRoutingModule} from './app-routing.module';
import {ErrorInterceptor} from './service/error-interceptor';
import {CreditInterceptor} from './service/credit-interceptor';
import {LoadingComponent} from './loading/loading.component';
import {InMemoryMenuService} from './service/in-memory-menu.service';
import {BaseModule, GlobalConfig} from '@sb/base';
import {
    NzAvatarModule,
    NzBadgeModule,
    NzBreadCrumbModule,
    NzButtonModule, NzCardModule,
    NzCheckboxModule,
    NzDrawerModule,
    NzDropDownModule,
    NzFormModule,
    NzGridModule,
    NzIconModule,
    NzInputModule,
    NzLayoutModule,
    NzMenuModule,
    NzNotificationModule, NzPopconfirmModule,
    NzSelectModule
} from 'ng-zorro-antd';
import {RegisterComponent} from './register/register.component';
import {NavigationComponent} from './navigation/navigation.component';
import {OuUserModifyModule} from '../system/ou/ou-user/ou-user-modify/ou-user-modify.module';
import {OuPasswordModifyModule} from '../system/ou/ou-user/ou-password-modify/ou-password-modify.module';
import {DelonFormConfig} from '@delon/form';
import {UnauthorizedComponent} from './unauthorized/unauthorized.component';
import {PublicNoticeComponent} from "../dr/public-notice/public-notice/public-notice.component";

registerLocaleData(zh);

export function fnDelonFormConfig(): DelonFormConfig {
    return Object.assign(new DelonFormConfig(), {
        ui: {
            spanLabel: 5,
            spanControl: 18,
            grid: {
                gutter: 1
            }
        }
    });
}

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        BaseModule,
        FormsModule,
        HttpClientModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'c'
        }),
        ReactiveFormsModule,
        AppRoutingModule,
        environment.production ? [] : InMemoryHttpClientModule.forRoot({
            dataEncapsulation: false,
            delay: 100,
            rootPath: environment.baseServerUrl
        }, InMemorySsoService),
        environment.production ? [] : InMemoryHttpClientModule.forRoot({
            dataEncapsulation: false,
            delay: 100,
            rootPath: environment.baseServerUrl
        }, InMemoryMenuService),
        NzMenuModule,
        NzDropDownModule,
        NzIconModule,
        NzLayoutModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzCheckboxModule,
        NzBreadCrumbModule,
        NzAvatarModule,
        NzDrawerModule,
        NzSelectModule,
        NzGridModule,
        OuUserModifyModule,
        OuPasswordModifyModule,
        NzBadgeModule,
        NzNotificationModule
    ],
    declarations: [
        AppComponent,
        FirstLevelMenuComponent,
        LoginComponent,
        IndexComponent,
        MenuComponent,
        BreadcrumbComponent,
        Error404Component,
        PopupLoginComponent,
        NotificationsComponent,
        CreateAdminComponent,
        LoadingComponent,
        RegisterComponent,
        NavigationComponent,
        UnauthorizedComponent
    ],

    providers: [
        LoginGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CreditInterceptor,
            multi: true
        },
        {
            provide: GlobalConfig,
            useValue: {
                baseServerUrl: environment.baseServerUrl
            } as GlobalConfig
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoginInterceptor,
            multi: true
        },
        environment.production ? {
            provide: HTTP_INTERCEPTORS,
            useClass: JsonInterceptor,
            multi: true
        } : [],
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        },
        {
            provide: DelonFormConfig,
            useFactory: fnDelonFormConfig
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

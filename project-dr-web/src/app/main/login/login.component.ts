import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MainService} from '../service/main.service';
import {environment} from '../../../environments/environment';
import {ReturnForm} from '@sb/base';
import {LoginUser} from '../entity/login-user';
import {SessionUser} from "../entity/session-user";
import {ShowMenu, ShowMenus} from "../entity/show-menu";
import {MenuService} from "../service/menu.service";
import {LoginGuard} from "../service/login.guard";
import {OuOrgUserService} from "../../system/ou/ou-org-user/service/ou-org-user.service";
import {OuOrgUser} from "../../system/ou/ou-org-user/entity/ou-org-user";
import {NzMessageService} from "ng-zorro-antd";

@Component({
    selector: 'sb-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit, AfterViewInit {

    /**
     * 错误消息
     */
    errorMessage = '';

    /**
     * 是否是发布模式
     */
    production = environment.production;

    /**
     * 验证码url
     */
    verifyCodeSrc;

    /**
     * 登录对象
     */
    login: LoginUser = {
        userName: '',
        password: '',
        orgId: '',
        verifyCode: null
    };

    _loginFor: string;

    systemLogin: boolean;

    validateForm: FormGroup;

    orgs: OuOrgUser[];

    get adminQueryParam() {
        if (this._loginFor) {
            return {system: true, loginFor: this._loginFor};
        } else {
            return {system: true};
        }
    }

    get normalQueryParam() {
        if (this._loginFor) {
            return {loginFor: this._loginFor};
        } else {
            return {};
        }
    }

    submitForm(): void {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
            this.validateForm.controls[i].updateValueAndValidity();
        }
    }

    constructor(private fb: FormBuilder,
                public mainService: MainService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private el: ElementRef,
                private renderer2: Renderer2,
                private menuService: MenuService,
                private orgUserService: OuOrgUserService,
                private message: NzMessageService,
    ) {
    }

    ngOnInit(): void {
        // 检查是否在登录状态，进行跳转
        this.mainService.checkLogin().subscribe(v => {
            if (v.success) {
                this.doRedirect();
            }
        });

        this.activatedRoute.queryParams.subscribe((params: Params) => {
            const loginFor: string = params['loginFor'];
            if (!loginFor) {
                this._loginFor = null;
            } else {
                this._loginFor = loginFor;
            }

            this.systemLogin = params['system'] === 'true';

            const o = {
                password: [null, [Validators.required]],
                rememberMe: [null]
            };

            if (this.production) {
                o['verifyCode'] = [null, [Validators.pattern(/^[0-9]{4}$/)]];
            }

            if (!this.systemLogin) {
                o['userName'] = [null, [Validators.required]];
            }

            this.validateForm = this.fb.group(o);

            this.validateForm.statusChanges.subscribe((value) => {
                this.errorMessage = null;
            });
        });

        this.refreshVerifyCode();

    }

    ngAfterViewInit(): void {

    }

    doLogin() {
        if (this.validateForm.valid) {
            this.mainService.login(this.login, this.systemLogin).subscribe((returnForm: ReturnForm<SessionUser>) => {
                if (returnForm.success) {
                    this.doRedirect();
                } else {
                    this.errorMessage = returnForm.errorMessage;
                    this.refreshVerifyCode();
                }
            });
        }
    }

    refreshVerifyCode() {
        this.verifyCodeSrc = `${environment.baseServerUrl}sso/getVerifyCodeImage?_=${new Date().getTime()}`;
    }

    private doRedirect() {
        if (this._loginFor && !this._loginFor.startsWith("/login")) {
            if (this._loginFor.lastIndexOf("/") === 0) {
                this.menuService.getShowMenu().subscribe((returnForm: ReturnForm<ShowMenus>) => {
                    if (returnForm.success) {
                        let showMenus = returnForm.message;
                        let menu = this.findMenu(showMenus);
                        if (menu !== null) {
                            let exist = false;
                            for (let i = 0; i < this.router.config.length; i++) {
                                const c = this.router.config[i];
                                exist = c.path === menu.code;
                            }
                            if (!exist) {
                                if (menu.urlType === 'ABSOLUTE') {
                                    this.router.config.splice(1, 0, {
                                        path: menu.code,
                                        loadChildren: 'src/app/main/redirect/redirect.module#RedirectModule',
                                        data: {breadcrumb: menu.name, link: menu.loadChildren},
                                        canLoad: [LoginGuard],
                                    });
                                } else {
                                    this.router.config.splice(1, 0, {
                                        path: menu.code,
                                        loadChildren: menu.loadChildren,
                                        data: {breadcrumb: menu.name},
                                        canLoad: [LoginGuard],
                                    });
                                }
                            }
                            this.router.navigate([this._loginFor]);
                        } else {
                            this.router.navigate(['/']);
                        }
                    }
                });
            } else {
                this.router.navigate([this._loginFor]);
            }
        } else {
            this.router.navigate(['/']);
        }
    }

    private findMenu(menus: ShowMenus): ShowMenu {
        for (let i = 0; i < menus.length; i++) {
            let menu = menus[i];
            if (('/' + menu.code) === this._loginFor) {
                return menu;
            }

            if (menu.children && menu.children.length > 0) {
                let childMenu = this.findMenu(menu.children);
                if (childMenu != null) {
                    return childMenu;
                }
            }
        }
        return null;
    }

    forgotPassword() {
        this.message.info('请联系管理员重置密码！');
    }
}

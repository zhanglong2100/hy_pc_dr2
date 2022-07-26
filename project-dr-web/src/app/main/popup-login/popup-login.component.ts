import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {LoginUser} from '../entity/login-user';
import {MainService} from '../service/main.service';
import {ReturnForm} from '@sb/base';
import {SessionUser} from "../entity/session-user";

@Component({
    selector: 'sb-popup-login',
    templateUrl: './popup-login.component.html',
    styleUrls: ['./popup-login.component.less']
})
export class PopupLoginComponent implements OnInit {

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
        verifyCode: null
    };
    validateForm: FormGroup;

    submitForm(): void {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
            this.validateForm.controls[i].updateValueAndValidity();
        }
    }

    constructor(private fb: FormBuilder,
                public mainService: MainService,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {

        // 检查是否在登录状态，跳出
        this.mainService.checkLogin().subscribe(v => {
            if (v.success) {
                this.doRedirect();
            }
        });

        const o = {
            userName: [null, [Validators.required]],
            password: [null, [Validators.required]],
            rememberMe: [null]
        };
        if (this.production) {
            o['verifyCode'] = [null, [Validators.pattern(/^[0-9]{4}$/)]];
        }
        this.validateForm = this.fb.group(o);
        this.validateForm.statusChanges.subscribe((value) => {
            this.errorMessage = null;
        });
        this.refreshVerifyCode();

        // 如果当前url是 /login开头，直接调出
        if (this.router.url.startsWith("/login")) {
            this.router.navigate([{
                outlets: {popup: null}
            }]);
        }
    }

    doLogin() {
        if (this.validateForm.valid) {
            this.mainService.login(this.login).subscribe((returnForm: ReturnForm<SessionUser>) => {
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
        this.router.navigate([{
            outlets: {popup: null}
        }]);
    }
}

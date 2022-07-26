import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {BASE_HTTP_OPTIONS, baseHandleError, ReturnForm} from '@sb/base';
import {LoginUser} from '../entity/login-user';
import {RegisterUser} from '../entity/register-user';
import {SessionUser} from "../entity/session-user";

@Injectable({
    providedIn: 'root'
})
export class MainService {

    private ssoUrl = environment.baseServerUrl + 'sso';

    private _needVerifyCode;

    constructor(private http: HttpClient) {
        this.checkSysVerifyCode();
    }

    /**
     * 登录服务
     * @param loginUser 登录对象
     * @param systemLogin 超管登录
     */
    login(loginUser: LoginUser, systemLogin = false): Observable<ReturnForm<SessionUser>> {
        if (!systemLogin) {
            return this.http.post<ReturnForm<SessionUser>>(`${this.ssoUrl}/login`, loginUser, BASE_HTTP_OPTIONS).pipe(
                catchError(baseHandleError<ReturnForm<SessionUser>>('login'))
            ).pipe(
                map(
                    (returnForm: ReturnForm<SessionUser>) => {
                        if (returnForm.success) {
                            window.localStorage.setItem('sessionUser', JSON.stringify(returnForm.message));
                        }
                        return returnForm;
                    }
                )
            );
        } else {
            return this.http.post<ReturnForm<SessionUser>>(`${this.ssoUrl}/systemLogin`, loginUser, BASE_HTTP_OPTIONS).pipe(
                catchError(baseHandleError<ReturnForm<SessionUser>>('systemLogin'))
            ).pipe(
                map(
                    (returnForm: ReturnForm<SessionUser>) => {
                        if (returnForm.success) {
                            window.localStorage.setItem('sessionUser', JSON.stringify(returnForm.message));
                        }
                        return returnForm;
                    }
                )
            );
        }
    }

    logout(): Observable<ReturnForm<string>> {
        return this.http.post<ReturnForm<string>>(`${this.ssoUrl}/logout`, null, BASE_HTTP_OPTIONS).pipe(
            catchError(baseHandleError<ReturnForm<string>>('logout'))
        );
    }

    /**
     * 尝试登录
     */
    checkLogin(): Observable<ReturnForm<string>> {
        return this.http.post<ReturnForm<string>>(`${this.ssoUrl}/checkLogin`, null, BASE_HTTP_OPTIONS).pipe(
            catchError(baseHandleError<ReturnForm<string>>('checkLogin'))
        );
    }

    /**
     * 创建管理员
     * @param user 登录用户对象
     */
    createAdmin(user: LoginUser): Observable<ReturnForm<string>> {
        return this.http.post<ReturnForm<string>>(`${this.ssoUrl}/createAdmin`, user, BASE_HTTP_OPTIONS).pipe(
            catchError(baseHandleError<ReturnForm<string>>('login'))
        );
    }

    /**
     * 发送验证码
     * @param telPhone 电话
     */
    sendCaptcha(telPhone: string): Observable<ReturnForm<string>> {
        return this.http.post<ReturnForm<string>>(`${this.ssoUrl}/generateSms`, {
            telPhone: telPhone
        }, BASE_HTTP_OPTIONS).pipe(
            catchError(baseHandleError<ReturnForm<string>>('sendCaptcha'))
        );
    }

    /**
     * 注册用户
     * @param registerUser 用户
     */
    register(registerUser: RegisterUser): Observable<ReturnForm<string>> {
        return this.http.post<ReturnForm<string>>(`${this.ssoUrl}/register`, registerUser, BASE_HTTP_OPTIONS).pipe(
            catchError(baseHandleError<ReturnForm<string>>('register'))
        );
    }

    /**
     * 切换部门
     * @param deptId 部门标识
     */
    changeDept(deptId: string): Observable<ReturnForm<SessionUser>> {
        return this.http.post<ReturnForm<SessionUser>>(`${this.ssoUrl}/changeDept`, {
            deptId: deptId
        }, BASE_HTTP_OPTIONS).pipe(
            catchError(baseHandleError<ReturnForm<SessionUser>>('changeDept'))
        ).pipe(
            map(
                (returnForm: ReturnForm<SessionUser>) => {
                    if (returnForm.success) {
                        window.localStorage.setItem('sessionUser', JSON.stringify(returnForm.message));
                    }
                    return returnForm;
                }
            )
        );
    }

    /**
     * 查看系统是否需要输入验证码
     */
    private checkSysVerifyCode() {
        return this.http.post<ReturnForm<boolean>>(`${this.ssoUrl}/needVerifyCode`, BASE_HTTP_OPTIONS).pipe(
            catchError(baseHandleError<ReturnForm<string>>('needVerifyCode'))
        ).subscribe((returnForm) => {
            this._needVerifyCode = returnForm.success && (returnForm.message === true);
        });
    }

    getNeedVerifyCode() {
        return this._needVerifyCode;
    }
}

import {Injectable} from '@angular/core';
import {HttpRequest} from '@angular/common/http';
import {ReturnForm} from '@sb/base';
import {InMemoryConfig, InMemoryDbService, RequestInfo} from '@sb/in-memory-http-client';
import {environment} from '../../../environments/environment';


@Injectable()
export class InMemorySsoService extends InMemoryDbService {

    /**
     * 是否在登录状态
     */
    private _login = false;

    createDb(reqInfo?: RequestInfo) {

        return {
            sso: []
        };
    }

    getDbKeys(): { [p: string]: string[] } {
        return {sso: ['userName']};
    }


    support(request: HttpRequest<any>): boolean {
        const config: InMemoryConfig = this.config;
        const url = request.url;
        return request.url.startsWith(config.rootPath + 'sso')
            || request.url.startsWith(config.rootPath + 'main');
    }

    /**
     * 登录
     * @param requestInfo RequestInfo对象
     */
    login(requestInfo: RequestInfo): any {
        const u = requestInfo.req.body['userName'];
        const p = requestInfo.req.body['password'];
        if (u === 'admin' && p === environment.adminPassword) {
            this._login = true;
            return true;
        } else {
            const returnForm: ReturnForm<string> = {
                success: false,
                errorMessage: '账号和密码有误！',
                status: -1
            };
            this._login = false;
            return returnForm;
        }
    }

    /**
     * 登出
     * @param requestInfo RequestInfo对象
     */
    logout(requestInfo: RequestInfo): any {
        this._login = false;
        return true;
    }

    /**
     * 创建管理员
     * @param requestInfo RequestInfo对象
     */
    createAdmin(requestInfo: RequestInfo): any {
        const s = requestInfo.req.body['userName'];
        if (s === 'admin') {
            return true;
        } else {
            const returnForm: ReturnForm<string> = {
                success: false,
                errorMessage: '账号和密码有误！',
                status: -1
            };
            return returnForm;
        }
    }

    /**
     * 创建管理员
     * @param requestInfo RequestInfo对象
     */
    checkLogin(requestInfo: RequestInfo): any {
        return this._login === true;
    }
}

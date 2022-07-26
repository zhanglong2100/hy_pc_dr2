import {Injectable} from '@angular/core';
import {BaseService} from '@sb/base';
import {OuUserSearchForm} from './entity/ou-user-search-form';
import {OuUser} from './entity/ou-user';
import {ReturnForm} from "@sb/base/core/entity";
import {catchError} from "rxjs/operators";
import {Observable} from "rxjs/index";
import {baseHandleError} from "@sb/base/core/service/base-http-service";
import {OuPasswordModify} from "./entity/ou-password-modify";

@Injectable({
    providedIn: 'root'
})
export class OuUserService extends BaseService<OuUser, OuUserSearchForm> {
    readonly basePath = "ou/user";

    /**
     * 修改密码
     * @param entity
     */
    modifyPassword(entity: OuPasswordModify): Observable<ReturnForm<string>> {
        return this._http.post<ReturnForm<string>>(`${this.url}/modifyPassword`, entity).pipe(
            catchError(baseHandleError<ReturnForm<string>>('modifyPassword'))
        );
    }

    resetPassword(userIds: string[]): Observable<ReturnForm<string>> {
        return this._http.post<ReturnForm<string>>(`${this.url}/resetPassword`, {['userIds']: userIds}).pipe(
            catchError(baseHandleError<ReturnForm<string>>('resetPassword'))
        );
    }
}

import {Injectable} from '@angular/core';
import {baseHandleError, BaseService, ReturnForm} from '@sb/base';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {UserRole} from '../entity/user-role';
import {UserRoleSearchForm} from '../entity/user-role-search-form';

/**
 * 机构服务
 */
@Injectable({
    providedIn: 'root'
})
export class UserRoleService extends BaseService<UserRole, UserRoleSearchForm> {


    readonly basePath = 'up/userRole';

    constructor(
        private http: HttpClient
    ) {
        super(http);
    }

    listByRoleId(roleId: string): Observable<ReturnForm<UserRole[]>> {
        return this.http.post<ReturnForm<UserRole[]>>(`${this.url}/listByRoleId`, {
            roleId: roleId
        }).pipe(
            catchError(baseHandleError<ReturnForm<UserRole[]>>('listByRoleId'))
        );
    }

    listByUserId(userId: string): Observable<ReturnForm<UserRole[]>> {
        return this.http.post<ReturnForm<UserRole[]>>(`${this.url}/listByUserId`, {
            userId: userId
        }).pipe(
            catchError(baseHandleError<ReturnForm<UserRole[]>>('listByUserId'))
        );
    }

    commitByUserId(roleIds: string[], userId: string): Observable<ReturnForm<string>> {
        return this.http.post<ReturnForm<string>>(`${this.url}/commitByUserId`, {
            roleIds: roleIds,
            userId: userId
        }).pipe(
            catchError(baseHandleError<ReturnForm<string>>('commitByUserId'))
        );
    }

    commitByRoleId(roleId: string, userIds: string[]): Observable<ReturnForm<string>> {
        return this.http.post<ReturnForm<string>>(`${this.url}/commitByRoleId`, {
            roleId: roleId,
            userIds: userIds
        }).pipe(
            catchError(baseHandleError<ReturnForm<string>>('commitByRoleId'))
        );
    }


    removeByUserId(roleIds: string[], userId: string): Observable<ReturnForm<string>> {
        return this.http.post<ReturnForm<string>>(`${this.url}/removeByUserId`, {
            roleIds: roleIds,
            userId: userId
        }).pipe(
            catchError(baseHandleError<ReturnForm<string>>('removeByUserId'))
        );
    }

    removeByRoleId(roleId: string, userIds: string[]): Observable<ReturnForm<string>> {
        return this.http.post<ReturnForm<string>>(`${this.url}/removeByRoleId`, {
            roleId: roleId,
            userIds: userIds
        }).pipe(
            catchError(baseHandleError<ReturnForm<string>>('removeByRoleId'))
        );
    }
}

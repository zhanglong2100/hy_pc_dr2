import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RmRoleFunctionSearchForm} from "../entity/rm-role-function-search-form";
import {RmRoleFunction} from "../entity/rm-role-function";
import {baseHandleError, BaseService, ReturnForm} from "@sb/base";
import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";

/**
 * 功能服务
 */
@Injectable({
    providedIn: 'root'
})
export class RmRoleFunctionService extends BaseService<RmRoleFunction, RmRoleFunctionSearchForm> {

    basePath = 'up/roleFunction';

    constructor(
        private http: HttpClient
    ) {
        super(http);
    }


    updateRoleFunc(roleId: string, funcIds: string[]): Observable<ReturnForm<string>> {
        return this.http.post<ReturnForm<string>>(`${this.url}/updateRoleFunc`, {
            roleId: roleId,
            ['funcIds']: funcIds
        }).pipe(
            catchError(baseHandleError<ReturnForm<string>>('post'))
        );
    }

}

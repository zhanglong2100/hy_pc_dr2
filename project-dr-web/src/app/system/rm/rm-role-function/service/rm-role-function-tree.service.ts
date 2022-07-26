import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseTreeService} from '@sb/base/core/service/base-tree.service';
import {RmRoleFunction} from "../entity/rm-role-function";
import {RmRoleFunctionSearchForm} from "../entity/rm-role-function-search-form";
import {RmRoleFunctionTreeNode} from "../entity/rm-role-function-tree-node";
import {Observable} from "rxjs";
import {baseHandleError, ReturnForm} from "@sb/base";
import {catchError} from "rxjs/operators";

/**
 * 功能服务
 */
@Injectable({
    providedIn: 'root'
})
export class RmRoleFunctionTreeService extends BaseTreeService<RmRoleFunction, RmRoleFunctionSearchForm, RmRoleFunctionTreeNode> {

    basePath = 'up/roleFunction';

    constructor(
        private http: HttpClient
    ) {
        super(http);
    }

    getRoleFuncNzTree(roleId: string): Observable<ReturnForm<string>> {
        return this.http.post<ReturnForm<string>>(`${this.url}/getRoleFuncNzTree`, {roleId: roleId}).pipe(
            catchError(baseHandleError<ReturnForm<string>>('getRoleFuncNzTree'))
        );
    }

}

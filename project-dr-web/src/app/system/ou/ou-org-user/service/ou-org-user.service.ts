import {Injectable} from '@angular/core';
import {BaseService, ReturnPage} from '@sb/base';
import {OuOrgUser} from '../entity/ou-org-user';
import {OuOrgUserSearchForm} from '../entity/ou-org-user-search-form';
import {ReturnForm} from '@sb/base/core/entity';
import {baseHandleError} from '@sb/base/core/service/base-http-service';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

/**
 * 机构服务
 */
@Injectable({
    providedIn: 'root'
})
export class OuOrgUserService extends BaseService<OuOrgUser, OuOrgUserSearchForm> {

    basePath = 'ou/orgUser';

    /**
     * 列表数据
     * @param loginName 登陆名
     */
    getCurrentUserDepts(): Observable<ReturnForm<OuOrgUser[]>> {
        return this._http.post<ReturnForm<OuOrgUser[]>>(`${this.url}/getCurrentUserDepts`, {})
            .pipe(
                catchError(baseHandleError<ReturnForm<OuOrgUser[]>>('getCurrentUserDepts'))
            );
    }


    listWithUserDetail(searchForm: OuOrgUserSearchForm): Observable<ReturnForm<ReturnPage<OuOrgUser>>> {
        return this._http.post<ReturnForm<ReturnPage<OuOrgUser>>>(`${this.url}/listWithUserDetail`, searchForm).pipe(
            catchError(baseHandleError<ReturnForm<ReturnPage<OuOrgUser>>>('listWithUserDetail'))
        );
    }

    commitMulti(userIds: string[], orgId: string, positionId: string): Observable<ReturnForm<string>> {
        return this._http.post<ReturnForm<string>>(`${this.url}/commitMulti`, {
            userIds: userIds,
            orgId: orgId,
            positionId: positionId
        }).pipe(
            catchError(baseHandleError<ReturnForm<string>>('commitMulti'))
        );
    }

}

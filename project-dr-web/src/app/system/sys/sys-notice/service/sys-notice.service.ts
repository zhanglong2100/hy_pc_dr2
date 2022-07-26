import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {ReturnForm} from "@sb/base/core/entity";
import {Observable} from "rxjs/index";
import {catchError} from "rxjs/operators";
import {baseHandleError} from "@sb/base/core/service/base-http-service";
import {SysNotice} from "../entity/sys-notice";

@Injectable({
    providedIn: 'root'
})
export class SysNoticeService {
    readonly basePath = `${environment.baseServerUrl}sys/sysNotice`;

    constructor(
        private http: HttpClient
    ) {
    }

    /**
     * 提交
     * @param entity
     */
    commit(entity: SysNotice): Observable<ReturnForm<SysNotice>> {
        return this.http.post<ReturnForm<SysNotice>>(`${this.basePath}/commit`, entity).pipe(
            catchError(baseHandleError<ReturnForm<SysNotice>>('commit'))
        );
    }

    getUnique(): Observable<ReturnForm<SysNotice>> {
        return this.http.post<ReturnForm<SysNotice>>(`${this.basePath}/getUnique`, {}).pipe(
            catchError(baseHandleError<ReturnForm<SysNotice>>('getUnique'))
        );
    }

}

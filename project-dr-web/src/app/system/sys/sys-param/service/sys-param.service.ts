import {Injectable} from '@angular/core';
import {BaseService} from '@sb/base';
import {SysParamSearchForm} from '../entity/sys-param-search-form';
import {SysParam} from '../entity/sys-param';
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class SysParamService extends BaseService<SysParam, SysParamSearchForm> {
    readonly basePath = "sys/sysParam";

    constructor(
        private http: HttpClient
    ) {
        super(http);
    }

    /*commit1(sysParam:SysParam): Observable<ReturnForm<string>> {
        return this.http.post<ReturnForm<string>>(`${this.url}/commit`, sysParam).pipe(
            catchError(baseHandleError<ReturnForm<string>>('commit'))
        );
    }*/
}

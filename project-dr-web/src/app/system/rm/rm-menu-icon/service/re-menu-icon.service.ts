import {Injectable} from "@angular/core";
import {baseHandleError, BaseService, ReturnForm} from "@sb/base";
import {RmMenuIcon} from "../entity/rm-menu-icon";
import {RmMenuIconSearchForm} from "../entity/rm-menu-icon-search-form";
import {catchError} from "rxjs/operators";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class RmMenuIconService extends BaseService<RmMenuIcon, RmMenuIconSearchForm> {
    readonly basePath = "ssyh/rmMenuIcon";

    constructor(
        private http: HttpClient
    ) {
        super(http);
    }

    getIconByName(name: string): Observable<ReturnForm<RmMenuIcon[]>> {
        return this._http.post<ReturnForm<RmMenuIcon[]>>(`${this.url}/getIconByName`, {
            name: name
        }).pipe(
            catchError(baseHandleError<ReturnForm<RmMenuIcon[]>>('getIconByName'))
        );
    }
}

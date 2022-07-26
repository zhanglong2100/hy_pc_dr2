import {Injectable} from '@angular/core';
import {baseHandleError, BaseService, ReturnForm} from '@sb/base';
import {AgencySupermarket} from './entity/agency-supermarket';
import {AgencySupermarketSearchForm} from './entity/agency-supermarket-search-form';
import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class AgencySupermarketService extends BaseService<AgencySupermarket, AgencySupermarketSearchForm> {

    basePath = 'dataReceive/agencySupermarket';

    exportPath = `${this.url}/export`;

    uploadUrl = `${this.url}/upload`;

    constructor(
        private http: HttpClient
    ) {
        super(http);
    }

    upload(formData: FormData): Observable<ReturnForm<string>> {
        return this.http.post<ReturnForm<string>>(`${this.url}/upload`, formData).pipe(
            catchError(baseHandleError<ReturnForm<string>>('upload'))
        );
    }

    sort(): Observable<ReturnForm<string>> {
        return this.http.post<ReturnForm<string>>(`${this.url}/sort`, null).pipe(
            catchError(baseHandleError<ReturnForm<string>>('sort'))
        );
    }


}

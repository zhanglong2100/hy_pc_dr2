import {Injectable} from '@angular/core';
import {baseHandleError, BaseService, ReturnForm} from '@sb/base';
import {PublicNoticeDownload} from './entity/public-notice-download';
import {PublicNoticeDownloadSearchForm} from './entity/public-notice-download-search-form';
import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class PublicNoticeDownloadService extends BaseService<PublicNoticeDownload, PublicNoticeDownloadSearchForm> {

    basePath = 'dataReceive/publicNoticeDownload';

    uploadUrl = `${this.url}/upload`;
    downloadPath = `${this.url}/download`;

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


}

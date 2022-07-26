import {Injectable} from '@angular/core';
import {baseHandleError, BaseService, ReturnForm} from '@sb/base';
import {PublicNoticeWebCrawler} from './entity/public-notice-web-crawler';
import {PublicNoticeWebCrawlerSearchForm} from './entity/public-notice-web-crawler-search-form';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/internal/operators';


@Injectable({
    providedIn: 'root'
})
export class PublicNoticeWebCrawlerService extends BaseService<PublicNoticeWebCrawler, PublicNoticeWebCrawlerSearchForm> {

    basePath = 'dataReceive/publicNoticeWebCrawler';
    analysisUrl = `${this.url}/analysis` ;
    stopUrl = `${this.url}/stopOrStart`;
    stopUrlBidding = `${this.url}/stopOrStartBidding`;

    constructor(
        private http: HttpClient
    ) {
        super(http);
    }

    analysis(formData: FormData): Observable<ReturnForm<string>> {
        return this.http.post<ReturnForm<any>>(this.analysisUrl, formData).pipe(
            catchError(baseHandleError<ReturnForm<string>>('analysis'))
        );
    }

    stopOrStart(formData: FormData): Observable<ReturnForm<string>> {
        return this.http.post<ReturnForm<string>>(this.stopUrl, formData).pipe(
            catchError(baseHandleError<ReturnForm<string>>('stopOrStart'))
        );
    }

    stopOrStartBidding(formData: FormData): Observable<ReturnForm<string>> {
        return this.http.post<ReturnForm<string>>(this.stopUrlBidding, formData).pipe(
            catchError(baseHandleError<ReturnForm<string>>('stopOrStartBidding'))
        );
    }

}

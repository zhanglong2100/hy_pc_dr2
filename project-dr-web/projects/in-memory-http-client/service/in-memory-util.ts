import {ResponseOptions} from '../interfaces';
import {Observable, Observer} from 'rxjs';
import {HttpHeaders, HttpResponse, HttpResponseBase} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {getStatusText, isSuccess, STATUS} from '../http-status-codes';
import {delayResponse} from '../delay-response';
import {Injectable} from '@angular/core';

@Injectable()
export class InMemoryUtil {
    // 返回Observable
    /**
     * Create a cold response Observable from a factory for ResponseOptions
     * @param resOptionsFactory - creates ResponseOptions when observable is subscribed
     * @param withDelay - if true (default), add simulated latency delay from configuration
     */
    createResponse$(resOptionsFactory: () => ResponseOptions, withDelay: number = 500): Observable<any> {
        const resOptions$ = this.createResponseOptions$(resOptionsFactory);
        const resp$ = this.createResponse$fromResponseOptions$(resOptions$);
        return withDelay === 0 ? resp$ : delayResponse(resp$, withDelay);
    }

    /**
     * Create a Response observable from ResponseOptions observable.
     */
    createResponse$fromResponseOptions$(resOptions$: Observable<ResponseOptions>): Observable<HttpResponse<any>> {
        return resOptions$.pipe(map((opts: HttpResponseBase) => new HttpResponse<any>(opts)));
    }


    // 返回ResponseOptions

    /**
     * Create a cold Observable of ResponseOptions.
     * @param resOptionsFactory - creates ResponseOptions when observable is subscribed
     */
    createResponseOptions$(resOptionsFactory: () => ResponseOptions): Observable<ResponseOptions> {

        return new Observable<ResponseOptions>((responseObserver: Observer<ResponseOptions>) => {
            let resOptions: ResponseOptions;
            try {
                resOptions = resOptionsFactory();
            } catch (error) {
                const err = error.message || error;
                resOptions = this.createErrorResponseOptions('', STATUS.INTERNAL_SERVER_ERROR, `${err}`);
            }

            const status = resOptions.status;
            try {
                resOptions.statusText = getStatusText(status);
            } catch (e) { /* ignore failure */
            }
            if (isSuccess(status)) {
                responseObserver.next(resOptions);
                responseObserver.complete();
            } else {
                responseObserver.error(resOptions);
            }
            return () => {
            }; // unsubscribe function
        });
    }

    createErrorResponseOptions(url: string, status: number, message: string): ResponseOptions {
        return {
            body: {error: `${message}`},
            url: url,
            headers: this.createHeaders({'Content-Type': 'application/json'}),
            status: status
        };
    }

    /**
     * Create standard HTTP headers object from hash map of header strings
     * @param headers 请求头
     */
    createHeaders(headers: { [index: string]: string; }): HttpHeaders {
        return new HttpHeaders(headers);
    }
}

import {HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';

/**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
export function baseHandleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

        console.error(error); // log to console instead

        // Let the app keep running by returning an empty result.
        return of(result as T);
    };
}

export const BASE_HTTP_OPTIONS = {
    headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}),
    withCredentials: true
};

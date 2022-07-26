import {HttpHeaders} from '@angular/common/http';

export interface ResponseOptions {
    /**
     * String, Object, ArrayBuffer or Blob representing the body of the {@link Response}.
     */
    body?: any;

    /**
     * Response headers
     */
    headers?: HttpHeaders;

    /**
     * Http {@link http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html status code}
     * associated with the response.
     */
    status?: number;

    /**
     * Status text for the status code
     */
    statusText?: string;
    /**
     * request url
     */
    url?: string;
}

import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {HttpErrorHandler} from './http-error-handler.service';
import {catchError} from 'rxjs/operators/catchError';

@Injectable()
export class AppHttpClient {

    static prefix = 'api';

    /**
     * AppHttpClient Constructor.
     */
    constructor(protected httpClient: HttpClient, protected errorHandler: HttpErrorHandler) {}

    public get<T>(uri: string, params = {}): Observable<T> {
        const httpParams = this.generateHttpParams(params);
        return this.httpClient.get<T>(this.prefixUri(uri), {params: httpParams}).pipe(catchError(err => this.errorHandler.handle(err)));
    }

    public post<T>(uri: string, params: object = null): Observable<T> {
        return this.httpClient.post<T>(this.prefixUri(uri), params).pipe(catchError(err => this.errorHandler.handle(err)));
    }

    public put<T>(uri: string, params: object = {}): Observable<T> {
        params = this.spoofHttpMethod(params, 'PUT');
        return this.httpClient.post<T>(this.prefixUri(uri), params).pipe(catchError(err => this.errorHandler.handle(err)));
    }

    public delete<T>(uri: string, params: object = {}): Observable<T> {
        params = this.spoofHttpMethod(params, 'DELETE');
        return this.httpClient.post<T>(this.prefixUri(uri), params).pipe(catchError(err => this.errorHandler.handle(err)));
    }

    /**
     * Prefix specified uri with backend API prefix.
     */
    private prefixUri(uri: string) {
        if (uri.indexOf('://') > -1) { return uri; }
        return AppHttpClient.prefix + '/' + uri;
    }

    /**
     * Generate http params for GET request.
     */
    private generateHttpParams(params: object) {
        let httpParams = new HttpParams();

        for (const key in params) {
            httpParams = httpParams.append(key, params[key]);
        }

        return httpParams;
    }

    /**
     * Spoof http method by adding "_method" to request params.
     */
    private spoofHttpMethod(params: object|FormData, method: 'PUT'|'DELETE'): object|FormData {
        if (params instanceof FormData) {
            (params as FormData).append('_method', method);
        } else {
            params['_method'] = method;
        }

        return params;
    }
}

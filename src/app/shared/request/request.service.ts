import { Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UtilsService } from '../../services/utils.service';
import { BrowserStorageService } from '@services/storage.service';

export class RequestConfig {
  appkey = '';
  prefixUrl = 'https://sandbox.practera.com/';
  // prefixUrl = 'http://local.practera.com/';
}

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private appkey: string;
  private prefixUrl: string;

  constructor(
    private http: HttpClient,
    private utils: UtilsService,
    private storage: BrowserStorageService,
    @Optional() config: RequestConfig
  ) {
    if (config) {
      this.appkey = config.appkey;
      this.prefixUrl = config.prefixUrl;
    }
  }

  /**
   *
   * @param {'Content-Type': string } header
   * @returns {HttpHeaders}
   */
  appendHeaders(header = {'Content-Type': 'application/json'}) {
    let headers = new HttpHeaders(header);
    return headers;
  }

  /**
   *
   * @param options
   * @returns {any}
   */
  setParams(options) {
    let params: any;
    if (!this.utils.isEmpty(options)) {
      params = new HttpParams();
      this.utils.each(options, (value, key) => {
        params = params.append(key, value);
      });
    }
    return params;
  }

  /**
   *
   * @param {string} endPoint
   * @param options
   * @param headers
   * @returns {Observable<any>}
   */
  get(endPoint: string = '', httpOptions?: any): Observable<any> {
    return this.http.get<any>(this.prefixUrl + endPoint, {
      headers: this.appendHeaders(httpOptions.headers),
      params: this.setParams(httpOptions.params)
    }).pipe(
      catchError(this.handleError<any>('API Request'))
    );
  }

  post(endPoint: string = '', data, httpOptions?: any): Observable<any> {
    return this.http.post<any>(this.prefixUrl + endPoint, data, {
      headers: this.appendHeaders(httpOptions.headers),
      params: this.setParams(httpOptions.params)
    }).pipe(
      catchError(this.handleError<any>('API Request'))
    );
  }


  /**
   *
   * @returns {string}
   */
  public getPrefixUrl() {
    return this.prefixUrl;
  }

  /**
   *
   * @returns {string}
   */
  public getAppkey() {
    return this.appkey;
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
   
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
   
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
   
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  // further enhance this for error reporting (piwik)
  private log(message: string) {
    console.log(message);
  }
}
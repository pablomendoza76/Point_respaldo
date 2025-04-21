import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { connHandler } from '@shared/functions/connHandler'
import { catchError, Observable, retry } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(endpoint: string): Observable<any> {
    return this.http.get<T>(endpoint).pipe(retry(1), catchError(connHandler))
  }
  post<T>(endpoint: string, body: object): Observable<any> {
    return this.http.post<T>(endpoint, body).pipe(retry(1), catchError(connHandler))
  }
  patch<T>(endpoint: string, body: object): Observable<any> {
    return this.http.patch<T>(endpoint, body).pipe(retry(1), catchError(connHandler))
  }
  delete<T>(endpoint: string): Observable<any> {
    return this.http.delete<T>(endpoint).pipe(retry(1), catchError(connHandler))
  }
}

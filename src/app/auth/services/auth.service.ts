import { Injectable } from '@angular/core'
import { AUTH_API } from '@auth/enums/api.enum'
import { AUTH_TOKEN } from '@auth/enums/token.enum'
import { AuthData, Credentials } from '@auth/interfaces/auth.interface'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { ApiService } from './api.service'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private srvAPI: ApiService) {}
  private auth$ = new BehaviorSubject<boolean>(false)

  get isAuth$() {
    return this.auth$.asObservable()
  }

  // TOKEN
  saveToken(authData: AuthData) {
    const auth = authData.token !== undefined
    if (auth) localStorage.setItem(AUTH_TOKEN.NAME, JSON.stringify(authData))
    if (this.isTokenSaved) this.auth$.next(auth)
  }

  get isTokenSaved() {
    return !!localStorage.getItem(AUTH_TOKEN.NAME)
  }

  recoverToken() {
    const token = localStorage.getItem(AUTH_TOKEN.NAME)
    return token && (JSON.parse(token) as AuthData)
  }

  login(credentials: Credentials): Observable<any> {
    // return this.srvAPI.post<{ data: AuthData }>(AUTH_API.LOGIN, credentials)
    console.log(AUTH_API.LOGIN)
    return of({ data: { ...credentials, token: AUTH_API.LOGIN } })
  }

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN.NAME)
    this.auth$.next(false)
  }
}

import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { AuthData } from '@auth/interfaces/auth.interface'
import { AuthService } from '@auth/services/auth.service'
import { env } from '@env/dev.env'

const isTokenExpired = (token: string) => {
  const expiry: number = JSON.parse(atob(token.split('.')[1]))?.exp || -1
  if (expiry === -1) return true

  return Math.floor(Date.now() / 1000) >= expiry
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.search('/login') !== -1) return next(req)

  const srvAuth = inject(AuthService)
  const token = srvAuth.recoverToken() as AuthData

  // if (!!!token?.token || (!!token?.token && isTokenExpired(token.token))) {
  //   srvAuth.logout()

  //   const router = inject(Router)
  //   router.navigate(['/login'], { queryParams: { session: 'expired' } })
  //   return next(req)
  // }

  return next(
    req.clone({
      headers: req.headers
        // prettier-ignore
        .set('x-api-key', env.x_api_key || '')
        .set('Authorization', !!token ? `Bearer ${token.token}` : ''),
    }),
  )
}

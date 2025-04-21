import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthService } from '@auth/services/auth.service'

export const authGuard: CanActivateFn = () => {
  const srvAuth = inject(AuthService)
  const router = inject(Router)

  if (srvAuth.isTokenSaved) return true

  router.navigateByUrl('/login')
  return false
}

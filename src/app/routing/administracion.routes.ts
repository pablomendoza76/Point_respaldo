import { Routes } from '@angular/router'
import { authGuard } from '@auth/functions/auth.guard'
import { ROOT_ADMINISTRACION, ROUTES_ADMINISTRACION } from './enums/administracion.enum'
import { routeMapper } from './functions/route.mapper'

export const administracion: Routes = [
  {
    path: ROOT_ADMINISTRACION.path,
    canActivate: [authGuard],
    children: routeMapper(ROUTES_ADMINISTRACION),
  },
]

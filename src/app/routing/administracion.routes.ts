import { Routes } from '@angular/router'
import { authGuard } from '@auth/functions/auth.guard'
import { ROUTES_ADMINISTRACION } from './enums/administracion.enum'
import { routeMapper } from './functions/route.mapper'

export const administracion: Routes = [
  {
    path: 'administracion',
    canActivate: [authGuard],
    children: routeMapper(ROUTES_ADMINISTRACION),
  },
]

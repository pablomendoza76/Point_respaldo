import { Routes } from '@angular/router'
import { authGuard } from '@auth/functions/auth.guard'
import { HomeComponent } from '@modules/administracion/pages/home/home.component'
import { ROOT_ADMINISTRACION, ROUTES_ADMINISTRACION } from './enums/administracion.enum'
import { routeMapper } from './functions/route.mapper'

export const administracion: Routes = [
  {
    path: ROOT_ADMINISTRACION.path,
    canActivate: [authGuard],
    children: [{ path: '', component: HomeComponent }, ...routeMapper(ROUTES_ADMINISTRACION)],
  },
]

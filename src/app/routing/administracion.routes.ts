import { Routes } from '@angular/router'
import { authGuard } from '@auth/functions/auth.guard'
import { BillingSofAdminComponent } from '@modules/administracion/pages/billing-sof-admin/billing-sof-admin.component'
import { ROUTES_ADMINISTRACION } from './enums/administracion.enum'
import { routeMapper } from './functions/route.mapper'

export const administracion: Routes = [
  {
    path: 'administracion',
    canActivate: [authGuard],
    children: [{ path: '', component: BillingSofAdminComponent }, ...routeMapper(ROUTES_ADMINISTRACION)],
  },
]

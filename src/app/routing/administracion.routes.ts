import { Routes } from '@angular/router'
import { authGuard } from '@auth/functions/auth.guard'
import { BillingSofAdminComponent } from '@modules/administracion/pages/billing-sof-admin/billing-sof-admin.component'
import { MarcasComponent } from '@modules/administracion/pages/Productos-legacy/marcas/marcas.component'
import { AdministracionComponent } from '@modules/administracion/pages/Productos-legacy/productos/administracion.component'
import { TarifasPorGrupoComponent } from '@modules/administracion/pages/Productos-legacy/tarifas-por-grupo/tarifas-por-grupo.component'
import { TiposProductosComponent } from '@modules/administracion/pages/Productos-legacy/tipos-productos/tipos-productos.component'
import { VistaGeneralComponent } from '@modules/administracion/pages/Productos-legacy/vista-general/vista-general.component'

// const productos: Routes = [
//   {
//     path: 'productos',
//     canActivate: [authGuard],
//     children: [
//       { path: '', component: AdministracionComponent }, // eliminar

//       ...ROUTES_ADMINISTRACION_PRODUCTOS.map((route) => {
//         return { path: route.path, component: route.comp }
//       }),
//       { path: '', redirectTo: ROUTES_ADMINISTRACION_PRODUCTOS[0].path, pathMatch: 'full' },
//     ],
//   },
// ]

const productos: Routes = [
  {
    path: 'productos',
    component: AdministracionComponent,
    canActivate: [authGuard],
    children: [
      { path: 'vista-general', component: VistaGeneralComponent },
      { path: 'marcas', component: MarcasComponent },
      { path: 'tipos-productos', component: TiposProductosComponent },
      { path: 'tarifas-por-grupo', component: TarifasPorGrupoComponent },
    ],
  },
]

export const administracion: Routes = [
  {
    path: 'administracion',
    canActivate: [authGuard],
    children: [{ path: '', component: BillingSofAdminComponent }, ...productos],
  },
]

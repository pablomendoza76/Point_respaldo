import { Routes } from '@angular/router'
import { authGuard } from '@auth/functions/auth.guard'
import { LoginComponent } from '@auth/pages/login/login.component'
import { BillingSofAdminComponent } from '@modules/administracion/pages/billing-sof-admin/billing-sof-admin.component'
import { ClientesVistaComponent } from '@modules/administracion/pages/clientes_general/clientes-vista/clientes-vista.component'
import { ClientesComponent } from '@modules/administracion/pages/clientes_general/clientes/clientes.component'
import { TiposClientesComponent } from '@modules/administracion/pages/clientes_general/tipos-clientes/tipos-clientes.component'
import { ConfiguracionComponent } from '@modules/administracion/pages/configuracion/configuracion.component'
import { CuentasContablesComponent } from '@modules/administracion/pages/cuentas/cuentas-contables/cuentas-contables.component'
import { CuentasVistasComponent } from '@modules/administracion/pages/cuentas/cuentas-vistas/cuentas-vistas.component'
import { PlanCuentasComponent } from '@modules/administracion/pages/cuentas/plan-cuentas/plan-cuentas.component'
import { PruebraComponent } from '@modules/administracion/pages/cuentas/pruebra/pruebra.component'
import { EmpresaComponent } from '@modules/administracion/pages/empresa/empresa.component'
import { ImportarComponent } from '@modules/administracion/pages/importar/importar.component'
import { MarcasComponent } from '@modules/administracion/pages/Productos/marcas/marcas.component'
import { AdministracionComponent } from '@modules/administracion/pages/Productos/productos/administracion.component'
import { TarifasPorGrupoComponent } from '@modules/administracion/pages/Productos/tarifas-por-grupo/tarifas-por-grupo.component'
import { TiposProductosComponent } from '@modules/administracion/pages/Productos/tipos-productos/tipos-productos.component'
import { VistaGeneralComponent } from '@modules/administracion/pages/Productos/vista-general/vista-general.component'
import { ProveedoresVistaComponent } from '@modules/administracion/pages/proveedores_general/proveedores-vista/proveedores-vista.component'
import { ProveedoresComponent } from '@modules/administracion/pages/proveedores_general/proveedores/proveedores.component'
import { TiposProveedoresComponent } from '@modules/administracion/pages/proveedores_general/tipos-proveedores/tipos-proveedores.component'
import { TiposPvpVistaComponent } from '@modules/administracion/pages/tipos_pvp_general/tipos-pvp-vista/tipos-pvp-vista.component'
import { TiposPVPComponent } from '@modules/administracion/pages/tipos_pvp_general/tipos-pvp/tipos-pvp.component'
import { DashboardComponent } from '@modules/dashboard/dashboard.component'
import { BarraBusquedaComponent } from '@reusables/barra-busqueda/barra-busqueda.component'
import { BarraUbicacionComponent } from '@reusables/barra-ubicacion/barra-ubicacion.component'
import { FormularioDinamicoComponent } from '@reusables/formulario-dinamico/formulario-dinamico.component'

//  Importar módulos desde Modulo_Administrador
//  Seguridad

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    canActivate: [authGuard],
    path: 'dashboard',
    component: DashboardComponent,
    canActivateChild: [authGuard],
    children: [
      //  Ruta de administrador
      {
        path: 'administrador',
        component: BillingSofAdminComponent,
        canActivate: [authGuard],
      },

      //  Ruta para administración de productos
      {
        path: 'productos',
        component: AdministracionComponent,
        canActivate: [authGuard],
        children: [
          { path: 'marcas', component: MarcasComponent },
          { path: 'vista-general', component: VistaGeneralComponent },
          { path: 'tipos-productos', component: TiposProductosComponent },
          { path: 'tarifas-por-grupo', component: TarifasPorGrupoComponent },
        ],
      },

      //  Ruta para importar datos
      {
        path: 'importar',
        component: ImportarComponent,
        canActivate: [authGuard],
      },

      //  Ruta para empresa
      {
        path: 'empresa',
        component: EmpresaComponent,
        canActivate: [authGuard],
      },

      //  Ruta para configuración
      {
        path: 'configuracion',
        component: ConfiguracionComponent,
        canActivate: [authGuard],
      },

      //  Ruta para proveedores
      {
        path: 'proveedores',
        component: ProveedoresVistaComponent,
        canActivate: [authGuard],
        children: [
          { path: 'gestion-proveedores', component: ProveedoresComponent },
          { path: 'tipo-proveedor', component: TiposProveedoresComponent },
        ],
      },

      //  Ruta para clientes
      {
        path: 'clientes',
        component: ClientesVistaComponent,
        canActivate: [authGuard],
        children: [
          { path: 'clientes-general', component: ClientesComponent },
          { path: 'tipo-cliente', component: TiposClientesComponent },
        ],
      },

      //  Ruta para tipos de PVP
      {
        path: 'tipos-pvp',
        component: TiposPvpVistaComponent,
        canActivate: [authGuard],
        children: [{ path: 'precios', component: TiposPVPComponent }],
      },

      //  Ruta para cuentas
      {
        path: 'cuentas',
        component: CuentasVistasComponent,
        canActivate: [authGuard],
        children: [
          { path: 'cuentas-contables', component: CuentasContablesComponent },
          { path: 'plan-cuentas', component: PlanCuentasComponent },
          { path: 'prueba', component: PruebraComponent },
          { path: 'prueba2', component: BarraBusquedaComponent },
          { path: 'prueba3', component: BarraUbicacionComponent },
          { path: 'prueba4', component: FormularioDinamicoComponent },
        ],
      },

      { path: '', redirectTo: 'administrador', pathMatch: 'full' },
    ],
  },

  //  Ruta por defecto
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  //  Ruta para manejar errores 404 (ruta no encontrada)
  { path: '**', redirectTo: '/login' },
]

import { Routes } from '@angular/router';

//  Importar módulos desde Modulo_Administrador
//  Seguridad
import { AuthGuard } from './auth.guard'
import { AppComponent } from './app.component'
import { PruebraComponent } from './modules/administracion/pages/cuentas/pruebra/pruebra.component'
import { BarraBusquedaComponent } from './shared/components/barra-busqueda/barra-busqueda.component'
import { BarraUbicacionComponent } from './shared/components/barra-ubicacion/barra-ubicacion.component'
import { NavbarComponent } from './shared/components/navbar/navbar.component'
import { DynamicMenuComponent } from './shared/components/dynamic-menu/dynamic-menu.component'
import { FormularioDinamicoComponent } from './shared/components/formulario-dinamico/formulario-dinamico.component'
import { FormularioDinamicoLoaderComponent } from './shared/components/formulario-dinamico-loader/formulario-dinamico-loader.component'
import { BillingSofAdminComponent } from './modules/administracion/pages/billing-sof-admin/billing-sof-admin.component'
import { ClientesVistaComponent } from './modules/administracion/pages/clientes_general/clientes-vista/clientes-vista.component'
import { ClientesComponent } from './modules/administracion/pages/clientes_general/clientes/clientes.component'
import { TiposClientesComponent } from './modules/administracion/pages/clientes_general/tipos-clientes/tipos-clientes.component'
import { ConfiguracionComponent } from './modules/administracion/pages/configuracion/configuracion.component'
import { CuentasContablesComponent } from './modules/administracion/pages/cuentas/cuentas-contables/cuentas-contables.component'
import { CuentasVistasComponent } from './modules/administracion/pages/cuentas/cuentas-vistas/cuentas-vistas.component'
import { PlanCuentasComponent } from './modules/administracion/pages/cuentas/plan-cuentas/plan-cuentas.component'
import { EmpresaComponent } from './modules/administracion/pages/empresa/empresa.component'
import { ImportarComponent } from './modules/administracion/pages/importar/importar.component'
import { MarcasComponent } from './modules/administracion/pages/Productos/marcas/marcas.component'
import { AdministracionComponent } from './modules/administracion/pages/Productos/productos/administracion.component'
import { TarifasPorGrupoComponent } from './modules/administracion/pages/Productos/tarifas-por-grupo/tarifas-por-grupo.component'
import { TiposProductosComponent } from './modules/administracion/pages/Productos/tipos-productos/tipos-productos.component'
import { VistaGeneralComponent } from './modules/administracion/pages/Productos/vista-general/vista-general.component'
import { ProveedoresVistaComponent } from './modules/administracion/pages/proveedores_general/proveedores-vista/proveedores-vista.component'
import { ProveedoresComponent } from './modules/administracion/pages/proveedores_general/proveedores/proveedores.component'
import { TiposProveedoresComponent } from './modules/administracion/pages/proveedores_general/tipos-proveedores/tipos-proveedores.component'
import { TiposPvpVistaComponent } from './modules/administracion/pages/tipos_pvp_general/tipos-pvp-vista/tipos-pvp-vista.component'
import { TiposPVPComponent } from './modules/administracion/pages/tipos_pvp_general/tipos-pvp/tipos-pvp.component'

export const routes: Routes = [
  { path: 'login', component: AppComponent },

  //  Ruta de administrador
  {
    path: 'administrador',
    component: BillingSofAdminComponent,
    canActivate: [AuthGuard]
  },

  //  Ruta para administración de productos
  {
    path: 'productos',
    component: AdministracionComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'marcas', component: MarcasComponent },
      { path: 'vista-general', component: VistaGeneralComponent },
      { path: 'tipos-productos', component: TiposProductosComponent },
      { path: 'tarifas-por-grupo', component: TarifasPorGrupoComponent }
    ]
  },

  //  Ruta para importar datos
  {
    path: 'importar',
    component: ImportarComponent,
    canActivate: [AuthGuard]
  },

  //  Ruta para empresa
  {
    path: 'empresa',
    component: EmpresaComponent,
    canActivate: [AuthGuard]
  },

  //  Ruta para configuración
  {
    path: 'configuracion',
    component: ConfiguracionComponent,
    canActivate: [AuthGuard]
  },

  //  Ruta para proveedores
  {
    path: 'proveedores',
    component: ProveedoresVistaComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'gestion-proveedores', component: ProveedoresComponent },
      { path: 'tipo-proveedor', component: TiposProveedoresComponent }
    ]
  },

  //  Ruta para clientes
  {
    path: 'clientes',
    component: ClientesVistaComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'clientes-general', component: ClientesComponent },
      { path: 'tipo-cliente', component: TiposClientesComponent }
    ]
  },

  //  Ruta para tipos de PVP
  {
    path: 'tipos-pvp',
    component: TiposPvpVistaComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'precios', component: TiposPVPComponent }
    ]
  },

  //  Ruta para cuentas
  {
    path: 'cuentas',
    component: CuentasVistasComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'cuentas-contables', component: CuentasContablesComponent },
      { path: 'plan-cuentas', component: PlanCuentasComponent },{ path: 'prueba', component: PruebraComponent }, 
      { path: 'prueba2', component: BarraBusquedaComponent}, { path: 'prueba3', component: BarraUbicacionComponent},
      { path: 'prueba4', component: FormularioDinamicoComponent}
    ]
  },

  //  Ruta por defecto
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  //  Ruta para manejar errores 404 (ruta no encontrada)
  { path: '**', redirectTo: '/login' }
];

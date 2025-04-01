import { Routes } from '@angular/router';

//  Importar módulos desde Modulo_Administrador
import { BillingSofAdminComponent } from './billing-sof-admin/billing-sof-admin.component';
import { AdministracionComponent } from './Modulo_Administrador/Productos/productos/administracion.component';
import { ImportarComponent } from './Modulo_Administrador/importar/importar.component';
import { ProveedoresComponent } from './Modulo_Administrador/proveedores_general/proveedores/proveedores.component';
import { TiposPVPComponent } from './Modulo_Administrador/tipos_pvp_general/tipos-pvp/tipos-pvp.component';
import { ClientesComponent } from './Modulo_Administrador/clientes_general/clientes/clientes.component';
import { CuentasContablesComponent } from './Modulo_Administrador/cuentas/cuentas-contables/cuentas-contables.component';
import { EmpresaComponent } from './Modulo_Administrador/empresa/empresa.component';
import { ConfiguracionComponent } from './Modulo_Administrador/configuracion/configuracion.component';
import { MarcasComponent } from './Modulo_Administrador/Productos/marcas/marcas.component';
import { TiposProductosComponent } from './Modulo_Administrador/Productos/tipos-productos/tipos-productos.component';
import { TarifasPorGrupoComponent } from './Modulo_Administrador/Productos/tarifas-por-grupo/tarifas-por-grupo.component';
import { TiposProveedoresComponent } from './Modulo_Administrador/proveedores_general/tipos-proveedores/tipos-proveedores.component';
import { TiposClientesComponent } from './Modulo_Administrador/clientes_general/tipos-clientes/tipos-clientes.component';
import { PlanCuentasComponent } from './Modulo_Administrador/cuentas/plan-cuentas/plan-cuentas.component';
import { VistaGeneralComponent } from './Modulo_Administrador/Productos/vista-general/vista-general.component';
import { ClientesVistaComponent } from './Modulo_Administrador/clientes_general/clientes-vista/clientes-vista.component';
import { ProveedoresVistaComponent } from './Modulo_Administrador/proveedores_general/proveedores-vista/proveedores-vista.component';
import { TiposPvpVistaComponent } from './Modulo_Administrador/tipos_pvp_general/tipos-pvp-vista/tipos-pvp-vista.component';
import { CuentasVistasComponent } from './Modulo_Administrador/cuentas/cuentas-vistas/cuentas-vistas.component';

//  Seguridad
import { AuthGuard } from './auth.guard';
import { AppComponent } from './app.component';
import { PruebraComponent } from './pruebra/pruebra.component';
import { BarraBusquedaComponent } from './componentes_reutilizables/barra-busqueda/barra-busqueda.component';
import { BarraUbicacionComponent } from './componentes_reutilizables/barra-ubicacion/barra-ubicacion.component';
import { NavbarComponent } from './componentes_reutilizables/navbar/navbar.component';
import { DynamicMenuComponent } from './componentes_reutilizables/dynamic-menu/dynamic-menu.component';
import { FormularioDinamicoComponent } from './componentes_reutilizables/formulario-dinamico/formulario-dinamico.component';
import { FormularioDinamicoLoaderComponent } from './componentes_reutilizables/formulario-dinamico-loader/formulario-dinamico-loader.component';

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

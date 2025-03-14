import { Routes } from '@angular/router';
import { BillingSofAdminComponent } from './billing-sof-admin/billing-sof-admin.component';
import { AdministracionComponent } from './Productos/productos/administracion.component';
import { ImportarComponent } from './Modulo_Administrador/importar/importar.component';
import { ProveedoresComponent } from './proveedores_general/proveedores/proveedores.component';
import { TiposPVPComponent } from './tipos_pvp_general/tipos-pvp/tipos-pvp.component';
import { ClientesComponent } from './clientes_general/clientes/clientes.component';
import { CuentasContablesComponent } from './Modulo_Administrador/cuentas/cuentas-contables/cuentas-contables.component';
import { EmpresaComponent } from './Modulo_Administrador/empresa/empresa.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { MarcasComponent } from './Productos/marcas/marcas.component';
import { TiposProductosComponent } from './Productos/tipos-productos/tipos-productos.component';
import { TarifasPorGrupoComponent } from './Productos/tarifas-por-grupo/tarifas-por-grupo.component';
import { TiposProveedoresComponent } from './proveedores_general/tipos-proveedores/tipos-proveedores.component';
import { TiposClientesComponent } from './clientes_general/tipos-clientes/tipos-clientes.component';
import { PlanCuentasComponent } from './Modulo_Administrador/cuentas/plan-cuentas/plan-cuentas.component';
import { VistaGeneralComponent } from './Productos/vista-general/vista-general.component';
import { ClientesVistaComponent } from './clientes_general/clientes-vista/clientes-vista.component';
import { ProveedoresVistaComponent } from './proveedores_general/proveedores-vista/proveedores-vista.component';
import { TiposPvpVistaComponent } from './tipos_pvp_general/tipos-pvp-vista/tipos-pvp-vista.component';
import { CuentasVistasComponent } from './Modulo_Administrador/cuentas/cuentas-vistas/cuentas-vistas.component';
import { AuthGuard } from './auth.guard'; // Asegúrate de que esta ruta sea correcta
import { AppComponent } from './app.component'; // Cambia LoginComponent por AppComponent

export const routes: Routes = [
  { path: 'login', component: AppComponent }, // Usa AppComponent en lugar de LoginComponent
  { 
    path: 'administrador', 
    component: BillingSofAdminComponent, 
    canActivate: [AuthGuard] // Proteger la ruta
  },
  { 
    path: 'administracion', 
    component: AdministracionComponent, 
    canActivate: [AuthGuard] // Proteger la ruta
  },
  { 
    path: 'importar', 
    component: ImportarComponent, 
    canActivate: [AuthGuard] // Proteger la ruta
  },
  { 
    path: 'empresa', 
    component: EmpresaComponent, 
    canActivate: [AuthGuard] // Proteger la ruta
  },
  { 
    path: 'configuracion', 
    component: ConfiguracionComponent, 
    canActivate: [AuthGuard] // Proteger la ruta
  },
  {
    path: 'productos',
    component: AdministracionComponent,
    canActivate: [AuthGuard], // Proteger la ruta
    children: [
      { path: 'marcas', component: MarcasComponent },
      { path: 'vista-general', component: VistaGeneralComponent },
      { path: 'tipos-productos', component: TiposProductosComponent },
      { path: 'tarifas-por-grupo', component: TarifasPorGrupoComponent },
    ],
  },
  {
    path: 'proveedores',
    component: ProveedoresVistaComponent,
    canActivate: [AuthGuard], // Proteger la ruta
    children: [
      { path: 'gestion-proveedores', component: ProveedoresComponent },
      { path: 'tipo-proveedor', component: TiposProveedoresComponent },
    ],
  },
  {
    path: 'clientes',
    component: ClientesVistaComponent,
    canActivate: [AuthGuard], // Proteger la ruta
    children: [
      { path: 'clientes-general', component: ClientesComponent },
      { path: 'tipo-cliente', component: TiposClientesComponent },
    ],
  },
  { 
    path: 'tipos-pvp', 
    component: TiposPvpVistaComponent, 
    canActivate: [AuthGuard], // Proteger la ruta
    children: [
      { path: 'precios', component: TiposPVPComponent }
    ]
  },
  { 
    path: 'cuentas', 
    component: CuentasVistasComponent, 
    canActivate: [AuthGuard], // Proteger la ruta
    children: [
      { path: 'cuentas-contables', component: CuentasContablesComponent },
      { path: 'Plan-Cuentas', component: PlanCuentasComponent },
    ] 
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Ruta por defecto
  { path: '**', redirectTo: '/login' } // Ruta no encontrada
];
import { ICON_NAME } from '@icons/enums/icon.enum'
import { IconProps } from '@icons/interfaces/icon.interface'
import { MarcasComponent } from '@modules/administracion/pages/Productos-legacy/marcas/marcas.component'
import { TiposProductosComponent } from '@modules/administracion/pages/Productos-legacy/tipos-productos/tipos-productos.component'
import { VistaGeneralComponent } from '@modules/administracion/pages/Productos-legacy/vista-general/vista-general.component'
import { HomeComponent } from '@modules/gestion-pedidos/pages/home/home.component'
import { RouteProps } from '@routing/interfaces/route.interface'

export enum ROUTES_ENUM_ADMINISTRACION {
  productos = 'productos',
  proveedores = 'proveedores',
  tipos_pvp = 'tipos-pvp',
  promociones = 'promociones',
  clientes = 'clientes',
  cuentas_contables = 'cuentas-contables',
  empresa = 'empresa',
  configuracion = 'configuracion',
}

export const ROUTES_ADMINISTRACION_PRODUCTOS: RouteProps[] = [
  {
    icon: { name: ICON_NAME['grid_view-fill'] } as IconProps,
    name: 'Gestión de Productos',
    path: 'gestion-productos',
    comp: VistaGeneralComponent,
  },
  { icon: { name: ICON_NAME.bookmark } as IconProps, name: 'Marcas', path: 'marcas', comp: MarcasComponent },
  { path: '', redirectTo: 'gestion-productos', pathMatch: 'full' },
]

export const ROUTES_ADMINISTRACION_PROVEEDORES: RouteProps[] = [
  { icon: { name: ICON_NAME.chat } as IconProps, name: 'Productos Infaltables', path: 'productos-infaltables', comp: TiposProductosComponent },
]

// MARK: ROOT
export const ROUTES_GESTION_PEDIDOS: RouteProps[] = [
  // Productos
  { path: ROUTES_ENUM_ADMINISTRACION.productos, children: ROUTES_ADMINISTRACION_PRODUCTOS, grupo: '1', name: 'Productos', icon: { name: ICON_NAME.box } },
  { path: ROUTES_ENUM_ADMINISTRACION.promociones, children: ROUTES_ADMINISTRACION_PRODUCTOS, grupo: '1', name: 'Promociones' },
  // Proveedores

  { path: '', redirectTo: ROUTES_ENUM_ADMINISTRACION.productos, pathMatch: 'full' },
]

export const ROOT_GESTION_PEDIDOS: RouteProps = {
  name: 'Gestión de Pedidos',
  path: 'gestion-pedidos',
  comp: HomeComponent,
  icon: { name: 'page_info' },
  children: ROUTES_GESTION_PEDIDOS,
}

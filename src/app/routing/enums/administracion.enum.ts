import { ICON_NAME } from '@icons/enums/icon.enum'
import { IconProps } from '@icons/interfaces/icon.interface'
import { MarcasComponent } from '@modules/administracion/pages/Productos-legacy/marcas/marcas.component'
import { AdministracionComponent } from '@modules/administracion/pages/Productos-legacy/productos/administracion.component'
import { TarifasPorGrupoComponent } from '@modules/administracion/pages/Productos-legacy/tarifas-por-grupo/tarifas-por-grupo.component'
import { TiposProductosComponent } from '@modules/administracion/pages/Productos-legacy/tipos-productos/tipos-productos.component'
import { VistaGeneralComponent } from '@modules/administracion/pages/Productos-legacy/vista-general/vista-general.component'
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
  { icon: { name: ICON_NAME.category } as IconProps, name: 'Tipos de Productos', path: 'tipos-productos', comp: TiposProductosComponent },
  { icon: { name: ICON_NAME.home_storage } as IconProps, name: 'Categorías', path: 'categorias', comp: TarifasPorGrupoComponent },
  { icon: { name: ICON_NAME.workspaces } as IconProps, name: 'Grupos de Productos', path: 'grupos-productos', comp: TiposProductosComponent },
  { icon: { name: ICON_NAME.chat } as IconProps, name: 'Productos Infaltables', path: 'productos-infaltables', comp: TiposProductosComponent },
]

// MARK: ROOT
export const ROUTES_ADMINISTRACION: RouteProps[] = [
  { path: ROUTES_ENUM_ADMINISTRACION.productos, children: ROUTES_ADMINISTRACION_PRODUCTOS, grupo: '1', name: 'Productos', icon: { name: ICON_NAME.box } },
  { path: ROUTES_ENUM_ADMINISTRACION.proveedores, children: ROUTES_ADMINISTRACION_PRODUCTOS, grupo: '1', name: 'Proveedores', icon: { name: ICON_NAME.local_shipping } },
  { path: ROUTES_ENUM_ADMINISTRACION.tipos_pvp, children: ROUTES_ADMINISTRACION_PRODUCTOS, grupo: '1', name: 'Tipos PVP', icon: { name: ICON_NAME.price_check } },
  { path: ROUTES_ENUM_ADMINISTRACION.promociones, children: ROUTES_ADMINISTRACION_PRODUCTOS, grupo: '1', name: 'Promociones' },
  { path: ROUTES_ENUM_ADMINISTRACION.clientes, children: ROUTES_ADMINISTRACION_PRODUCTOS, grupo: '2', name: 'Clientes', icon: { name: ICON_NAME.person_book } },
  { path: ROUTES_ENUM_ADMINISTRACION.cuentas_contables, children: ROUTES_ADMINISTRACION_PRODUCTOS, grupo: '3', name: 'Cuentas Contables', icon: { name: ICON_NAME.table_view } },
  { path: ROUTES_ENUM_ADMINISTRACION.empresa, children: ROUTES_ADMINISTRACION_PRODUCTOS, grupo: '4', name: 'Empresa', icon: { name: ICON_NAME.corporate_fare } },
  { path: ROUTES_ENUM_ADMINISTRACION.configuracion, children: ROUTES_ADMINISTRACION_PRODUCTOS, grupo: '4', name: 'Configuración', icon: { name: ICON_NAME.settings } },
]

export const ROOT_ADMINISTRACION: RouteProps = {
  name: 'Administración',
  path: 'administracion',
  comp: AdministracionComponent,
  icon: { name: 'apps' },
  children: ROUTES_ADMINISTRACION,
}

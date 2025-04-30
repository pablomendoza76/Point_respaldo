import { ICON_NAME } from '@icons/enums/icon.enum'
import { IconProps } from '@icons/interfaces/icon.interface'
import { MarcasComponent } from '@modules/administracion/pages/Productos-legacy/marcas/marcas.component'
import { TarifasPorGrupoComponent } from '@modules/administracion/pages/Productos-legacy/tarifas-por-grupo/tarifas-por-grupo.component'
import { TiposProductosComponent } from '@modules/administracion/pages/Productos-legacy/tipos-productos/tipos-productos.component'
import { VistaGeneralComponent } from '@modules/administracion/pages/Productos-legacy/vista-general/vista-general.component'
import { HomeComponent } from '@modules/logistica/pages/home/home.component'
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

export const ROOT_LOGISTICA: RouteProps = {
  name: 'Logística',
  path: 'logistica',
  comp: HomeComponent,
  icon: { name: 'page_info' },
  children: [
    {
      path: ROUTES_ENUM_ADMINISTRACION.productos,
      grupo: '1',
      name: 'Productos',
      icon: { name: ICON_NAME.box },
      children: [
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
        { path: '', redirectTo: 'gestion-productos', pathMatch: 'full' },
      ],
    },
    {
      path: ROUTES_ENUM_ADMINISTRACION.proveedores,
      grupo: '1',
      name: 'Proveedores',
      icon: { name: ICON_NAME.local_shipping },
      children: [
        { icon: { name: ICON_NAME.chat } as IconProps, name: 'Productos Infaltables', path: 'productos-infaltables', comp: TiposProductosComponent },
        { path: '', redirectTo: 'productos-infaltables', pathMatch: 'full' },
      ],
    },
    { path: '', redirectTo: ROUTES_ENUM_ADMINISTRACION.productos, pathMatch: 'full' },
  ],
}

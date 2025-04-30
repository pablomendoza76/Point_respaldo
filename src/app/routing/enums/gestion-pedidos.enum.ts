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
}

export const ROOT_GESTION_PEDIDOS: RouteProps = {
  name: 'Gestión de Pedidos',
  path: 'gestion-pedidos',
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
        { path: '', redirectTo: 'gestion-productos', pathMatch: 'full' },
      ],
    },
    {
      path: ROUTES_ENUM_ADMINISTRACION.proveedores,
      grupo: '1',
      name: 'Promociones',
      children: [
        { icon: { name: ICON_NAME.chat } as IconProps, name: 'Productos Infaltables', path: 'productos-infaltables', comp: TiposProductosComponent },
        { path: '', redirectTo: 'productos-infaltables', pathMatch: 'full' },
      ],
    },
    { path: '', redirectTo: ROUTES_ENUM_ADMINISTRACION.productos, pathMatch: 'full' },
  ],
}

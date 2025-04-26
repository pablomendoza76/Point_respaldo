import { iconFiller } from '@icons/functions/icon.filler'
import { ICON_FILL, IconProps } from '@icons/interfaces/icon.interface'
import { MarcasComponent } from '@modules/administracion/pages/Productos-legacy/marcas/marcas.component'
import { TarifasPorGrupoComponent } from '@modules/administracion/pages/Productos-legacy/tarifas-por-grupo/tarifas-por-grupo.component'
import { TiposProductosComponent } from '@modules/administracion/pages/Productos-legacy/tipos-productos/tipos-productos.component'
import { VistaGeneralComponent } from '@modules/administracion/pages/Productos-legacy/vista-general/vista-general.component'
import { RouteProps } from '@routing/interfaces/route.interface'

export const ROUTES_ADMINISTRACION = {
  productos: 'productos',
}

export const ROUTES_ADMINISTRACION_PRODUCTOS: RouteProps[] = [
  { icon: { name: 'grid_view', fill: 'filled' as ICON_FILL } as IconProps, name: 'Gestión de Productos', path: 'gestion-productos', comp: VistaGeneralComponent },
  { icon: { name: 'bookmark' } as IconProps, name: 'Marcas', path: 'marcas', comp: MarcasComponent },
  { icon: { name: 'category' } as IconProps, name: 'Tipos de Productos', path: 'tipos-productos', comp: TiposProductosComponent },
  { icon: { name: 'home_storage' } as IconProps, name: 'Categorías', path: 'categorias', comp: TarifasPorGrupoComponent },
  { icon: { name: 'workspaces' } as IconProps, name: 'Grupos de Productos', path: 'grupos-productos', comp: TiposProductosComponent },
  { icon: { name: 'chat' } as IconProps, name: 'Productos Infaltables', path: 'productos-infaltables', comp: TiposProductosComponent },
].map((route) => {
  route.icon = iconFiller(route.icon)
  return route
})

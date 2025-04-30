import { ICON_NAME } from '@icons/enums/icon.enum'
import { IconProps } from '@icons/interfaces/icon.interface'
import { ClientesComponent } from '@modules/logistica/pages/clientes/clientes.component'
import { HomeComponent } from '@modules/logistica/pages/home/home.component'
import { DespachosComponent } from '@modules/logistica/pages/operaciones/despachos/despachos.component'
import { GuiasRemisionComponent } from '@modules/logistica/pages/operaciones/guias-remision/guias-remision.component'
import { TransportistasComponent } from '@modules/logistica/pages/transportistas/transportistas.component'
import { VendedoresComponent } from '@modules/logistica/pages/vendedores/vendedores.component'
import { MatrizVisitasComponent } from '@modules/logistica/pages/zonas-rutas/matriz-visitas/matriz-visitas.component'
import { PlanificacionComponent } from '@modules/logistica/pages/zonas-rutas/planificacion/planificacion.component'
import { RutasComponent } from '@modules/logistica/pages/zonas-rutas/rutas/rutas.component'
import { ZonasSegmentosComponent } from '@modules/logistica/pages/zonas-rutas/zonas-segmentos/zonas-segmentos.component'
import { RouteProps } from '@routing/interfaces/route.interface'

// MARK: ROOT
export enum ROUTES_ENUM_LOGISTICA {
  'zonas-rutas' = 'zonas-rutas',
  'operaciones' = 'operaciones',
  'transportistas' = 'transportistas',
  'vendedores' = 'vendedores',
  'clientes' = 'clientes',
}

export const ROOT_LOGISTICA: RouteProps = {
  name: 'Logística',
  path: 'logistica',
  comp: HomeComponent,
  icon: { name: 'route' },
  children: [
    {
      path: ROUTES_ENUM_LOGISTICA['zonas-rutas'],
      grupo: '1',
      name: 'Zonas y Rutas',
      icon: { name: ICON_NAME.activity_zone },
      children: [
        { icon: { name: ICON_NAME.zoom_in_map } as IconProps, name: 'Zonas y Segmentos', path: 'zonas-segmentos', comp: ZonasSegmentosComponent },
        { icon: { name: ICON_NAME.guide } as IconProps, name: 'Rutas', path: 'rutas', comp: RutasComponent },
        { icon: { name: ICON_NAME.schedule } as IconProps, name: 'Planificación', path: 'planificacion', comp: PlanificacionComponent },
        { icon: { name: ICON_NAME.table_convert } as IconProps, name: 'Matriz de Visitas', path: 'matriz-visitas', comp: MatrizVisitasComponent },
        { path: '', redirectTo: 'zonas-segmentos', pathMatch: 'full' },
      ],
    },
    {
      path: ROUTES_ENUM_LOGISTICA['operaciones'],
      grupo: '1',
      name: 'Operaciones',
      icon: { name: ICON_NAME['road-map'] },
      children: [
        { icon: { name: ICON_NAME.two_pager_store } as IconProps, name: 'Despachos', path: 'despachos', comp: DespachosComponent },
        { icon: { name: ICON_NAME.assignment_turned_in } as IconProps, name: 'Guías de Remisión', path: 'guias-remision', comp: GuiasRemisionComponent },
        { path: '', redirectTo: 'despachos', pathMatch: 'full' },
      ],
    },
    {
      path: ROUTES_ENUM_LOGISTICA.transportistas,
      grupo: '2',
      name: 'Transportistas',
      icon: { name: ICON_NAME['local_shipping'] },
      comp: TransportistasComponent,
    },
    { path: ROUTES_ENUM_LOGISTICA.vendedores, grupo: '2', name: 'Vendedores', icon: { name: ICON_NAME.badge }, comp: VendedoresComponent },
    { path: ROUTES_ENUM_LOGISTICA.clientes, grupo: '2', name: 'Clientes', icon: { name: ICON_NAME.storefront }, comp: ClientesComponent },
    { path: '', redirectTo: ROUTES_ENUM_LOGISTICA['zonas-rutas'], pathMatch: 'full' },
  ],
}

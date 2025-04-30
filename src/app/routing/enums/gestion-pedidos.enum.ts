import { ICON_NAME } from '@icons/enums/icon.enum'
import { FacturacionComponent } from '@modules/gestion_pedidos/pages/facturacion/facturacion.component'
import { HomeComponent } from '@modules/gestion_pedidos/pages/home/home.component'
import { PedidosComponent } from '@modules/gestion_pedidos/pages/pedidos/pedidos.component'
import { RouteProps } from '@routing/interfaces/route.interface'

export enum ROUTES_ENUM_GESTION_PEDIDOS {
  pedidos = 'pedidos',
  facturacion = 'facturacion',
}

export const ROOT_GESTION_PEDIDOS: RouteProps = {
  name: 'Gestión de Pedidos',
  path: 'gestion-pedidos',
  comp: HomeComponent,
  icon: { name: ICON_NAME.stacks },
  children: [
    {
      path: ROUTES_ENUM_GESTION_PEDIDOS.pedidos,
      grupo: '1',
      name: 'Pedidos',
      icon: { name: ICON_NAME.package_2 },
      comp: PedidosComponent,
    },
    {
      path: ROUTES_ENUM_GESTION_PEDIDOS.facturacion,
      grupo: '1',
      name: 'Facturaciones',
      icon: { name: ICON_NAME.assignment },
      comp: FacturacionComponent,
    },
  ],
}

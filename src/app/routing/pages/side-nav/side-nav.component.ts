import { Component } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { RouterModule } from '@angular/router'
import { ROUTES_ADMINISTRACION, ROUTES_ADMINISTRACION_PRODUCTOS } from '@routing/enums/administracion.enum'
import { MODULE_ROUTES } from '@routing/enums/modules.enum'
import { routeGrouping } from '@routing/functions/route.grouping'
import { RouteProps } from '@routing/interfaces/route.interface'
import { RoutingService } from '@routing/services/routing.service'

@Component({
  selector: 'app-side-nav',
  imports: [MatIconModule, RouterModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent {
  constructor(private srvRouting: RoutingService) {
    this.srvRouting.routeState$.subscribe((route) => {
      const segments = route?.url.split('/').filter((segment) => segment)
      this.currentRoute = segments && MODULE_ROUTES.find((route) => route.path == segments[1])
      this.currentSubRoute = segments && this.currentRoute?.children && this.currentRoute?.children.find((route) => route.path == segments[2])
    })
  }

  groups = routeGrouping(ROUTES_ADMINISTRACION)
  subgroups = ROUTES_ADMINISTRACION_PRODUCTOS
  currentRoute?: RouteProps = {} as any
  currentSubRoute?: RouteProps = {} as any
}

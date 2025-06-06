import { Component } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { RouterModule } from '@angular/router'
import { ICON_NAME } from '@icons/enums/icon.enum'
import { SidebarButtonComponent } from '@reusables/sidebar-button/sidebar-button.component'
import { MODULE_ROUTES } from '@routing/enums/modules.enum'
import { filterRoutes } from '@routing/functions/route.filter'
import { routeGrouping } from '@routing/functions/route.grouping'
import { RouteProps } from '@routing/interfaces/route.interface'
import { RoutingService } from '@routing/services/routing.service'

@Component({
  selector: 'app-side-nav',
  imports: [MatIconModule, RouterModule, SidebarButtonComponent],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent {
  constructor(private srvRouting: RoutingService) {
    this.srvRouting.routeState$.subscribe((route) => {
      const segments = route?.url.split('/').filter((segment) => segment)
      this.currentRoute = segments && MODULE_ROUTES.find((route) => route.path == segments[1])
      this.currentSubRoute = segments && this.currentRoute?.children && this.currentRoute?.children.find((route) => route.path == segments[2])
      this.groups = routeGrouping(this.currentRoute?.children || [])
      this.subgroups = filterRoutes(this.currentSubRoute?.children || [])
    })
  }

  groups?: RouteProps[][] = []
  subgroups?: RouteProps[] = []
  currentRoute?: RouteProps = {} as any
  currentSubRoute?: RouteProps = {} as any
  isSideNavCollapsed = true
  sideNaveLabel = this.isSideNavCollapsed ? '© 2024' : '© 2024 Punto Pymes CIA'
  sideNavIcon = this.isSideNavCollapsed ? ICON_NAME.right_panel_close : ICON_NAME.right_panel_open

  toggleSideNav(): void {
    this.isSideNavCollapsed = !this.isSideNavCollapsed
    this.sideNaveLabel = this.isSideNavCollapsed ? '© 2024' : '© 2024 Punto Pymes CIA'
    this.sideNavIcon = this.isSideNavCollapsed ? ICON_NAME.right_panel_close : ICON_NAME.right_panel_open
  }
}

import { Component, computed, signal } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { RouterModule } from '@angular/router'
import { MODULE_ROUTES } from '@routing/enums/modules.enum'
import { filterRoutes } from '@routing/functions/route.filter'
import { RouteProps } from '@routing/interfaces/route.interface'
import { RoutingService } from '@routing/services/routing.service'

@Component({
  selector: 'app-home',
  imports: [MatIconModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private srvRouting: RoutingService) {
    this.srvRouting.routeState$.subscribe((route) => {
      const segments = route?.url.split('/').filter((segment) => segment)
      const moduleChildren = (segments && MODULE_ROUTES.find((module) => module.path == segments[1])?.children) || []
      this.routes = filterRoutes(moduleChildren)
    })
  }

  routes: RouteProps[] = []

  searchQuery = signal<string>('')
  filteredRoutes = computed(() => (this.searchQuery() ? this.routes.filter((route) => route.name && route.name.toLowerCase().includes(this.searchQuery())) : this.routes))
}

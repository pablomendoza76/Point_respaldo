import { Component, computed, signal } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { RouterModule } from '@angular/router'
import { ROUTES_ADMINISTRACION } from '@routing/enums/administracion.enum'
import { MODULE_ROUTES } from '@routing/enums/modules.enum'
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
      this.currentRoute = segments && MODULE_ROUTES.find((route) => route.path == segments[1])
    })
  }

  currentRoute?: RouteProps = {} as any
  routes = ROUTES_ADMINISTRACION.slice(0, -1)

  searchQuery = signal<string>('')
  filteredRoutes = computed(() => (this.searchQuery() ? this.routes.filter((route) => route.name && route.name.toLowerCase().includes(this.searchQuery())) : this.routes))
}

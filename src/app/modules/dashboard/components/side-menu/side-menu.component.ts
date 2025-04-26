import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { NavigationEnd, Router, RouterModule } from '@angular/router'
import { ROUTES_ADMINISTRACION, ROUTES_ADMINISTRACION_PRODUCTOS } from '@routing/enums/administracion.enum'
import { routeGrouping } from '@routing/functions/route.grouping'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-side-menu',
  imports: [MatIconModule, RouterModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
})
export class SideMenuComponent implements OnInit, OnDestroy {
  groups = routeGrouping(ROUTES_ADMINISTRACION)
  subgroups = ROUTES_ADMINISTRACION_PRODUCTOS
  currentRoute = ''
  currentSubRoute = ''
  currentRouteIcon: any
  currentRouteName: any
  currentSubRouteName: any
  private routerSubscription: Subscription | undefined

  constructor(private router: Router) {}

  ngOnInit() {
    // Subscribe to router events
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Execute the route parsing logic
        this.updateRouteInfo()
      }
    })

    // Run initially for the current route
    this.updateRouteInfo()
  }

  private updateRouteInfo() {
    const currentLocation = window.location.pathname.split('/').filter((segment) => segment) // Remove empty segments
    this.currentRoute = '/' + currentLocation.slice(0, -2).join('/')
    this.currentSubRoute = '/' + currentLocation.slice(0, -1).join('/')

    const admin = ROUTES_ADMINISTRACION.find((route) => route.path === currentLocation[currentLocation.length - 2])
    const admin_prods = ROUTES_ADMINISTRACION_PRODUCTOS.find((route) => route.path === currentLocation[currentLocation.length - 1])
    this.currentRouteIcon = admin?.icon?.name
    this.currentRouteName = admin?.name
    this.currentSubRouteName = admin_prods?.name
  }

  ngOnDestroy() {
    // Clean up the subscription
    this.routerSubscription?.unsubscribe()
  }
}

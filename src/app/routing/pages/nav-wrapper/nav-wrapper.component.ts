import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SideNavComponent } from '@routing/pages/side-nav/side-nav.component'
import { TopNavComponent } from '@routing/pages/top-nav/top-nav.component'
import { RoutingService } from '@routing/services/routing.service'

@Component({
  selector: 'app-nav-wrapper',
  imports: [RouterModule, TopNavComponent, SideNavComponent],
  templateUrl: './nav-wrapper.component.html',
  styleUrl: './nav-wrapper.component.scss',
})
export class NavWrapperComponent {
  constructor(private srvRouting: RoutingService) {
    this.srvRouting.routeState$.subscribe((route) => {
      const segments = route?.url.split('/').filter((segment) => segment)
      this.isDashboard = (segments && segments.length === 1 && segments[0] === 'dashboard') || false
    })
  }

  isDashboard = true
}

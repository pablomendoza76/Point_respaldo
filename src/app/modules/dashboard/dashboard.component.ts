import { Component, OnInit } from '@angular/core'
import { NavigationEnd, Router, RouterModule } from '@angular/router'
import { filter } from 'rxjs'
import { NavComponent } from './components/nav/nav.component'
import { SideMenuComponent } from './components/side-menu/side-menu.component'
import { SideSubMenuComponent } from './components/side-sub-menu/side-sub-menu.component'

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, NavComponent, SideMenuComponent, SideSubMenuComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router) {}

  isAdminRoute = true

  ngOnInit(): void {
    // this.isAdminRoute = this.router.url === '/dashboard/administrador'

    // Subscribe to router events to update isAdminRoute
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.isAdminRoute = event.urlAfterRedirects === '/dashboard/administrador'
    })
  }
}

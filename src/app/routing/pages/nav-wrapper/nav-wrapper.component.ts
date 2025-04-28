import { Component, OnInit } from '@angular/core'
import { NavigationEnd, Router, RouterModule } from '@angular/router'
import { filter } from 'rxjs'
import { SideNavComponent } from '../side-nav/side-nav.component'
import { TopNavComponent } from '../top-nav/top-nav.component'

@Component({
  selector: 'app-nav-wrapper',
  imports: [RouterModule, TopNavComponent, SideNavComponent],
  templateUrl: './nav-wrapper.component.html',
  styleUrl: './nav-wrapper.component.scss',
})
export class NavWrapperComponent implements OnInit {
  constructor(private router: Router) {}

  isAdminRoute = true

  ngOnInit(): void {
    this.isAdminRoute = this.router.url.includes('/dashboard/administrador')

    // Subscribe to router events to update isAdminRoute
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.isAdminRoute = event.urlAfterRedirects.includes('/dashboard/administrador')
    })
  }
}

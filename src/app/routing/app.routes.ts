import { Route, Routes } from '@angular/router'
import { authGuard } from '@auth/functions/auth.guard'
import { LoginComponent } from '@auth/pages/login/login.component'
import { DashboardComponent } from '@modules/dashboard/dashboard.component'
import { MODULE_ROUTES } from './enums/modules.enum'
import { routeMapper } from './functions/route.mapper'
import { RouteProps } from './interfaces/route.interface'
import { NavWrapperComponent } from './pages/nav-wrapper/nav-wrapper.component'

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    canActivate: [authGuard],
    path: 'dashboard',
    component: NavWrapperComponent,
    canActivateChild: [authGuard],
    children: [
      { path: '', component: DashboardComponent },

      // Mapping
      ...MODULE_ROUTES.map(
        (module: RouteProps) =>
          ({
            canActivate: [authGuard],
            path: module.path,
            canActivateChild: [authGuard],
            children: [{ path: '', component: module.comp }, ...routeMapper(module.children || [])],
          } as Route),
      ),
    ],
  },

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
]

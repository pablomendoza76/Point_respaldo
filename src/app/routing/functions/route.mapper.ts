import { authGuard } from '@auth/functions/auth.guard'
import { RouteProps } from '@routing/interfaces/route.interface'

export function routeMapper(routes: RouteProps[]) {
  return [
    ...routes.map((route) => {
      return {
        path: route.path,
        canActivate: [authGuard],
        children: !!route.children
          ? [
              ...route.children.map((route) => {
                return { path: route.path, component: route.comp }
              }),
              { path: '', redirectTo: route.children[0].path, pathMatch: 'full' as 'prefix' | 'full' },
            ]
          : [],
      }
    }),
    { path: '', redirectTo: routes[0].path, pathMatch: 'full' as 'prefix' | 'full' },
  ]
}

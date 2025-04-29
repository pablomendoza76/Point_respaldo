import { authGuard } from '@auth/functions/auth.guard'
import { RouteProps } from '@routing/interfaces/route.interface'

export function routeMapper(routes: RouteProps[]) {
  return [
    ...routes.map((route) => {
      return {
        path: route.path,
        component: route.comp,
        canActivate: [authGuard],
        children: !!route.children
          ? [
              ...route.children.map((route) => {
                if (!route.comp && route.redirectTo) return { path: route.path, redirectTo: route.redirectTo, pathMatch: route.pathMatch }
                return { path: route.path, component: route.comp }
              }),
            ]
          : [],
      }
    }),
  ]
}

import { RouteFilters } from '@routing/interfaces/filters.interface'
import { RouteProps } from '@routing/interfaces/route.interface'

export function filterRoutes(routes: RouteProps[], filters: RouteFilters = { omitEmptyPath: true, omitRedirects: true }): RouteProps[] {
  return routes.filter((route) => filters.omitEmptyPath && route.path !== '' && filters.omitRedirects && !route.redirectTo)
}

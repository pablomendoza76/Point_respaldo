import { RouteFilters } from '@routing/interfaces/filters.interface'
import { RouteProps } from '@routing/interfaces/route.interface'

export function filterRoutes(routes: RouteProps[], filters: RouteFilters = { omitRedirects: true }) {
  return routes.filter((route) => filters.omitRedirects && !route.redirectTo)
}

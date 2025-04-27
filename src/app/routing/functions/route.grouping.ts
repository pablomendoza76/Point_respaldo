import { RouteProps } from '@routing/interfaces/route.interface'

export function routeGrouping(routes: RouteProps[]): RouteProps[][] {
  // compose object per groups
  const groups: { [x: string]: RouteProps[] } = {} as any
  routes.forEach((route) => {
    if (!!route.grupo && !!!groups[route.grupo]) groups[route.grupo] = []
    if (!!route.grupo) groups[route.grupo].push(route)
  })

  // extract groups to a 2-dim array
  return [...Object.values(groups)]
}

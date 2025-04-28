export interface RouteState {
  url: string
  path: string
  title?: string
  params?: Record<string, string>
  queryParams?: Record<string, string>
  data?: Record<string, any>
}

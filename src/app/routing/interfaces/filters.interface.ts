interface Filters {
  omitEmptyPath: boolean
  omitRedirects: boolean
}

export interface RouteFilters extends Partial<Filters> {}

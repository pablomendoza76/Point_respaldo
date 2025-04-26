export enum ICON_NAME_FILLED {
  // administracion
  grid_view = 'grid_view',
}

export enum ICON_NAME_OUTLINED {
  notifications = 'notifications',
  apps = 'apps',
  support_agent = 'support_agent',
  info = 'info',
  account_circle = 'account_circle',
  home = 'home',
  dashboard = 'dashboard',

  // nav
  box = 'box',
  local_shipping = 'local_shipping',
  price_check = 'price_check',
  discount_percent = 'discount_percent',
  person_book = 'person_book',
  table_view = 'table_view',
  corporate_fare = 'corporate_fare',
  settings = 'settings',

  // administracion
  home_storage = 'home_storage',
  bookmark = 'bookmark',
  category = 'category',
  workspaces = 'workspaces',
  chat = 'chat',
}

export const ICON_NAME = {
  ...ICON_NAME_FILLED,
  ...ICON_NAME_OUTLINED,
}

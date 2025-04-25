import { Icon } from './icon.interface'

export const ICON_NAMES = {
  notifications: 'notifications',
  apps: 'apps',
  support_agent: 'support_agent',
  info: 'info',
  account_circle: 'account_circle',
}

export const outlined: Icon[] = [
  ...Object.values(ICON_NAMES).map((name) => {
    return { name }
  }),
].map((icon: Partial<Icon>) => {
  icon.fill = 'outlined'
  return icon
}) as Icon[]

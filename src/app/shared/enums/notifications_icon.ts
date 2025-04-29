type keys = 'info' | 'warning' | 'error' | 'success'

interface NotificationIcon {
  icon: string
  keywords: string[]
}

const more_icons: NotificationIcon[] = [
  {
    icon: 'sell',
    keywords: ['promoción', 'promocines'],
  },
  {
    icon: 'system_update_alt',
    keywords: ['actualizar', 'actualización'],
  },
  {
    icon: 'gavel',
    keywords: ['SRI', 'IVA'],
  },
]

export const NOTIFICATIONS_ICONS: Record<keys, NotificationIcon[]> = {
  info: [
    {
      icon: 'info',
      keywords: ['info'],
    },
    ...more_icons,
  ],
  warning: [
    {
      icon: 'warning',
      keywords: ['warning'],
    },
    ...more_icons,
  ],
  error: [
    {
      icon: 'close',
      keywords: ['error'],
    },
    ...more_icons,
  ],
  success: [
    {
      icon: 'check_circle',
      keywords: ['success'],
    },
    ...more_icons,
  ],
}

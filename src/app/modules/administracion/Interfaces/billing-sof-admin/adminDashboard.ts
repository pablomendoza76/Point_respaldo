export interface BusinessStat {
  value: number
  icon: string
  label: string
}

export interface Module {
  name: string
  icon: string
  path: string
}

export interface ModuleGroup {
  category: string
  modules: Module[]
}

export interface Notification {
  title: string
  description: string
  date: string
  type: string
}

export interface NotificationGroup {
  category: string
  notifications: Notification[]
}

export interface TopProduct {
  name: string
  units: number
  total: number
}

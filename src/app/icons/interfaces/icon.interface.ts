export type ICON_FILL = 'filled' | 'outlined' | 'round' | 'sharp' | 'two-tone'

export interface Icon {
  name: string
  fill: ICON_FILL
  path: string
}

export interface IconProps extends Partial<Icon> {}

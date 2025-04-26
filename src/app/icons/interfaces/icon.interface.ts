export enum ICON_FILL {
  filled = 'filled',
  outlined = 'outlined',
  round = 'round',
  sharp = 'sharp',
  two_tone = 'two-tone',
}

export interface Icon {
  name: string
  fill: ICON_FILL
  path: string
}

export interface IconProps extends Partial<Icon> {}

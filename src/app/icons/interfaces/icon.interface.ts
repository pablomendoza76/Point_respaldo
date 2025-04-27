export enum ICON_FILL {
  outlined = 'outlined',
}

export interface Icon {
  name: string
  path: string
}

export interface IconProps extends Partial<Icon> {}

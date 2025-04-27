import { ICON_FILL, IconProps } from '@icons/interfaces/icon.interface'

export function loadIcons(icons: Object, fill: ICON_FILL = ICON_FILL.outlined): IconProps[] {
  return [
    ...Object.values(icons).map((name) => {
      return { name } as IconProps
    }),
  ]
  //   .map((icon: IconProps) => {
  //   icon.fill = fill
  //   return icon
  // }) as IconProps[]
}

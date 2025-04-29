import { IconProps } from '@icons/interfaces/icon.interface'

export function loadIcons(icons: Object): IconProps[] {
  return [
    ...Object.values(icons).map((name) => {
      return { name } as IconProps
    }),
  ]
}

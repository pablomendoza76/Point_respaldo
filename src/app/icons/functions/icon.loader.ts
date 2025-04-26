import { ICON_NAMES_FILLED, ICON_NAMES_OUTLINED } from '@icons/enums/icon.enum'
import { IconProps } from '@icons/interfaces/icon.interface'

export function loadFilled(): IconProps[] {
  return [
    ...Object.values(ICON_NAMES_FILLED).map((name) => {
      return { name } as IconProps
    }),
  ].map((icon: IconProps) => {
    icon.fill = 'filled'
    return icon
  }) as IconProps[]
}

export function loadOutlined(): IconProps[] {
  return [
    ...Object.values(ICON_NAMES_OUTLINED).map((name) => {
      return { name } as IconProps
    }),
  ].map((icon: IconProps) => {
    icon.fill = 'outlined'
    return icon
  }) as IconProps[]
}

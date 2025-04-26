import { ICON_NAME_FILLED, ICON_NAME_OUTLINED } from '@icons/enums/icon.enum'
import { ICON_FILL, IconProps } from '@icons/interfaces/icon.interface'

export function loadFilled(): IconProps[] {
  return [
    ...Object.values(ICON_NAME_FILLED).map((name) => {
      return { name } as IconProps
    }),
  ].map((icon: IconProps) => {
    icon.fill = ICON_FILL.filled
    return icon
  }) as IconProps[]
}

export function loadOutlined(): IconProps[] {
  return [
    ...Object.values(ICON_NAME_OUTLINED).map((name) => {
      return { name } as IconProps
    }),
  ].map((icon: IconProps) => {
    icon.fill = ICON_FILL.outlined
    return icon
  }) as IconProps[]
}

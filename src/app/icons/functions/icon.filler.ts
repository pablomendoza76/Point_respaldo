import { ICON_FILL, IconProps } from '@icons/interfaces/icon.interface'

export function iconFiller(icon: IconProps, fill: ICON_FILL = ICON_FILL.outlined, force = false): IconProps {
  if (force) icon.fill = fill
  else if (!!!icon.fill) icon.fill = fill
  return icon
}

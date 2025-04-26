import { Type } from '@angular/core'
import { IconProps } from 'src/app/icons/interfaces/icon.interface'

interface Route {
  name: string
  path: string
  comp: Type<any>
  grupo: string
  icon: IconProps
}

export interface RouteProps extends Partial<Route> {}

import { Type } from '@angular/core'
import { RedirectFunction } from '@angular/router'
import { IconProps } from 'src/app/icons/interfaces/icon.interface'

interface Route {
  name: string
  path: string
  comp: Type<any>
  grupo: string
  icon: IconProps
  children: RouteProps[]
  redirectTo: string | RedirectFunction
  pathMatch: 'prefix' | 'full'
}

export interface RouteProps extends Partial<Route> {}

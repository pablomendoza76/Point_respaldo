import { Component } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { RouteProps } from '@routing/interfaces/route.interface'

const rutas: (Partial<RouteProps> & { icon: string })[] = [
  {
    name: 'Productos',
    grupo: '1',
    icon: 'home',
  },
  {
    name: 'Proveedores',
    grupo: '1',
    icon: 'home',
  },
  {
    name: 'Tipos PVP',
    grupo: '1',
    icon: 'home',
  },
  {
    name: 'Promociones',
    grupo: '1',
    icon: 'home',
  },
  {
    name: 'Clientes',
    grupo: '2',
    icon: 'home',
  },
  {
    name: 'Cuentas Contables',
    grupo: '3',
    icon: 'home',
  },
  {
    name: 'Empresa',
    grupo: '4',
    icon: 'home',
  },
  {
    name: 'Configuración',
    grupo: '4',
    icon: 'home',
  },
]

@Component({
  selector: 'app-side-menu',
  imports: [MatIconModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
})
export class SideMenuComponent {
  grupo1 = rutas.filter((r) => +r.grupo! == 1)
  grupo2 = rutas.filter((r) => +r.grupo! == 2)
  grupo3 = rutas.filter((r) => +r.grupo! == 3)
  grupo4 = rutas.filter((r) => +r.grupo! == 4)
}

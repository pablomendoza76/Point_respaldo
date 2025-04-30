import { Component, input } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-modulos-tarjetas',
  standalone: true,
  imports: [MatIconModule, RouterModule],
  templateUrl: './modulos-tarjetas.component.html',
  styleUrl: './modulos-tarjetas.component.scss',
})
export class ModulosTarjetasComponent {
  path = input<string>('')
  iconName = input<string>('')
  moduleName = input<string>('')
}

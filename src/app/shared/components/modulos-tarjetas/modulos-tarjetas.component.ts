import { Component, input } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-modulos-tarjetas',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './modulos-tarjetas.component.html',
  styleUrl: './modulos-tarjetas.component.scss',
})
export class ModulosTarjetasComponent {
  inconName = input<string>('')
  moduleName = input<string>('')
}

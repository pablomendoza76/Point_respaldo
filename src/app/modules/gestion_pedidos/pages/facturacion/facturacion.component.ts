import { Component, signal } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-facturacion',
  imports: [MatIconModule],
  templateUrl: './facturacion.component.html',
  styleUrl: './facturacion.component.scss',
})
export class FacturacionComponent {
  isFiltersOpen = signal(false)

  toggleFilters() {
    this.isFiltersOpen.update((prev) => !prev)
  }
}

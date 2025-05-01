import { Component, signal } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-pedidos',
  imports: [MatIconModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.scss',
})
export class PedidosComponent {
  isFiltersOpen = signal(false)

  toggleFilters() {
    this.isFiltersOpen.update((prev) => !prev)
  }
}

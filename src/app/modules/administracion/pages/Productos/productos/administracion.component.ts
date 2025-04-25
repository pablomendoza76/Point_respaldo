import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { DynamicMenuComponent, MenuItem } from '@reusables/dynamic-menu/dynamic-menu.component'
import { MENU_CONFIG } from '@routes/enums/menu.config'

@Component({
  selector: 'app-administracion',
  standalone: true,
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.scss'],
  imports: [CommonModule, RouterModule, DynamicMenuComponent],
})
export class AdministracionComponent {
  /** Estado del menú colapsado */
  isMenuCollapsed = false

  /** Menú principal */
  menuPadre: MenuItem[] = MENU_CONFIG.principales

  /** Submenús hijos por módulo */
  menuHijosMap: { [modulo: string]: MenuItem[] } = MENU_CONFIG.hijos

  /** Módulo activo actual */
  moduloActivo: string = 'Productos'

  /** Opción activa actual */
  opcionActiva: string = ''

  constructor(private router: Router) {}

  /** Alterna el estado de colapso del menú */
  toggleMenuCollapse(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed
  }

  /** Maneja el click en un módulo del menú padre */
  onModuloClick(modulo: MenuItem): void {
    this.moduloActivo = modulo.label
    this.opcionActiva = '' // Resetear opción activa al cambiar de módulo

    // Si el módulo tiene una ruta directa, navegar a ella
    if (modulo.route) {
      this.router.navigate([`dashboard/${modulo.route}`])
    }
  }

  /** Maneja el click en una opción del menú hijo */
  onMenuHijoClick(item: MenuItem): void {
    this.opcionActiva = item.label

    if (item.route) {
      this.router.navigate([`dashboard/${item.route}`])
    }

    console.log('Hijo clickeado:', item)
  }

  /** Obtiene los hijos del módulo activo */
  get menuHijos(): MenuItem[] {
    return this.menuHijosMap[this.moduloActivo] || []
  }

  /** Verifica si un módulo está activo */
  isModuloActive(modulo: string): boolean {
    return this.moduloActivo === modulo
  }

  /** Verifica si una opción está activa */
  isOpcionActive(opcion: string): boolean {
    return this.opcionActiva === opcion
  }
}

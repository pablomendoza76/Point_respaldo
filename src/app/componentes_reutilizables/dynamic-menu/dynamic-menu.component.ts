import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IconosComponent } from '@app/Iconos_Modulos_Svg/iconos/iconos.component';

/**
 * Interfaz para definir los elementos del menú.
 */
export interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  isActive?: boolean;
}

/**
 * Componente que representa un menú dinámico con soporte para módulos padre e hijo.
 */
@Component({
  selector: 'app-dynamic-menu',
  standalone: true,
  imports: [CommonModule, IconosComponent],
  templateUrl: './dynamic-menu.component.html',
  styleUrls: ['./dynamic-menu.component.scss']
})
export class DynamicMenuComponent implements OnInit {
  /** Lista de módulos padre disponibles */
  @Input() menuPadre: MenuItem[] = [];

  /** Mapa de submódulos hijos por módulo padre */
  @Input() menuHijosMap: { [modulo: string]: MenuItem[] } = {};

  /** Módulo padre activo al inicializar el menú */
  @Input() moduloActivo: string = '';

  /** Evento emitido al hacer clic en un submódulo hijo */
  @Output() itemClicked = new EventEmitter<MenuItem>();

  /** Estado de colapso del menú padre */
  isCollapsed: boolean = true;

  /** Módulo padre actualmente seleccionado */
  moduloSeleccionado: string = '';

  constructor(private router: Router) {}

  /**
   * Inicializa el componente, selecciona el módulo padre activo
   * y marca el submódulo activo según la URL.
   */
  ngOnInit(): void {
    // Selección automática de módulo activo si no se especifica
    this.moduloSeleccionado = this.moduloActivo || this.detectarModuloDesdeUrl() || this.menuPadre[0]?.label || '';

    this.marcarHijoActivo();
  }

  /**
   * Detecta automáticamente el módulo padre según la URL actual.
   * @returns Nombre del módulo padre coincidente o undefined
   */
  private detectarModuloDesdeUrl(): string | undefined {
    const url = this.router.url;
    return this.menuPadre.find(padre =>
      (this.menuHijosMap[padre.label] || []).some(hijo => url.includes(hijo.route || ''))
    )?.label;
  }

  /**
   * Marca como activo el submódulo hijo cuya ruta coincide con la URL actual.
   */
  private marcarHijoActivo(): void {
    const hijos = this.menuHijosMap[this.moduloSeleccionado] || [];
    const currentUrl = this.router.url;

    hijos.forEach(item => {
      item.isActive = currentUrl.includes(item.route || '');
    });
  }

  /**
   * Maneja el clic sobre un módulo padre y recalcula hijos activos.
   * @param item Módulo padre clickeado
   */
  onPadreClick(item: MenuItem): void {
    this.moduloSeleccionado = item.label;
    this.marcarHijoActivo();
  }

  /**
   * Maneja el clic sobre un submódulo hijo, lo marca como activo y navega.
   * @param item Submódulo hijo clickeado
   */
  onHijoClick(item: MenuItem): void {
    const hijos = this.menuHijosMap[this.moduloSeleccionado] || [];

    hijos.forEach(h => (h.isActive = false));
    item.isActive = true;

    if (item.route) {
      this.router.navigate([item.route]);
    }

    this.itemClicked.emit(item);
  }

  /**
   * Devuelve la lista de submódulos hijos del módulo padre activo.
   */
  get hijos(): MenuItem[] {
    return this.menuHijosMap[this.moduloSeleccionado] || [];
  }

  /**
   * Alterna el estado de colapso del menú lateral padre.
   */
  toggleMenu(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}

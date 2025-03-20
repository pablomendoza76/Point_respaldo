import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importa RouterModule

/**
 * Componente que representa una barra de ubicación (breadcrumb) dinámica.
 * Este componente muestra la ruta actual y permite la navegación a niveles superiores.
 */
@Component({
  selector: 'app-barra-ubicacion',
  standalone: true, // Convierte el componente en standalone
  imports: [CommonModule, RouterModule], // Importa módulos necesarios
  templateUrl: './barra-ubicacion.component.html',
  styleUrls: ['./barra-ubicacion.component.scss']
})
export class BarraUbicacionComponent {
  /**
   * Ruta base a la que redirige el botón de home.
   * @type {string}
   */
  @Input() homeRoute: string = 'administrador'; // Ruta por defecto para el botón de home

  /**
   * Evento que se emite cuando el usuario hace clic en un breadcrumb.
   * @type {EventEmitter<string>}
   */
  @Output() navigate = new EventEmitter<string>();

  /**
   * Lista de breadcrumbs generada dinámicamente.
   * @type {{ label: string, path?: string }[]}
   */
  breadcrumbs: { label: string, path?: string }[] = [];

  /**
   * Constructor del componente.
   * @param {Router} router - Servicio de Angular para manejar la navegación.
   * @param {ActivatedRoute} route - Servicio de Angular para obtener la ruta actual.
   */
  constructor(private router: Router, private route: ActivatedRoute) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.generateBreadcrumbs();
  }

  /**
   * Genera los breadcrumbs dinámicamente basados en la ruta actual.
   */
  generateBreadcrumbs(): void {
    const url = this.router.url; // Obtiene la URL completa (ej: '/cuentas/prueba')
    const segments = url.split('/').filter(segment => segment); // Divide la URL en segmentos

    // Construye los breadcrumbs
    this.breadcrumbs = segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`; // Ruta acumulada
      return {
        label: segment.charAt(0).toUpperCase() + segment.slice(1), // Capitaliza el segmento
        path: index < segments.length - 1 ? path : undefined // No enlace para el último segmento
      };
    });

    // Agrega el breadcrumb de home al inicio
    this.breadcrumbs.unshift({
      label: 'Administración',
      path: `/${this.homeRoute}` // Ruta del botón de home
    });
  }

  /**
   * Maneja el evento de clic en un breadcrumb.
   * @param {string} path - La ruta a la que se debe navegar.
   */
  onNavigate(path: string): void {
    this.navigate.emit(path); // Emite el evento de navegación
    this.router.navigate([path]); // Navega a la ruta
  }
}
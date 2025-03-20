import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-barra-busqueda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './barra-busqueda.component.html',
  styleUrls: ['./barra-busqueda.component.scss'],
})
export class BarraBusquedaComponent {
  // Propiedades de entrada
  @Input() opcionesBusqueda: { value: string; label: string }[] = []; // Opciones de búsqueda
  @Input() grupos: string[] = []; // Grupos para filtros
  @Input() marcas: string[] = []; // Marcas para filtros
  @Input() columnasDisponibles: { name: string; selected: boolean }[] = []; // Columnas disponibles
  @Input() textoBotonAgregar: string = 'Agregar'; // Texto del botón de agregar

  // Propiedades de salida
  @Output() buscarEvent = new EventEmitter<{ tipo: string; valor: string }>();
  @Output() filtrarEvent = new EventEmitter<{ grupo: string; marca: string; filtro: string }>();
  @Output() exportarEvent = new EventEmitter<void>();
  @Output() importarEvent = new EventEmitter<void>();
  @Output() agregarEvent = new EventEmitter<void>();

  // Variables internas
  searchType: string = '';
  searchValue: string = '';
  mostrarFiltros: boolean = false;
  mostrarColumnas: boolean = false;
  filtroGrupo: string = '';
  filtroMarca: string = '';
  filtroActivo: string = 'todos';

  // Métodos
  cambiarTipoBusqueda(): void {
    this.searchValue = '';
    this.actualizarBusqueda();
  }

  actualizarBusqueda(): void {
    this.buscarEvent.emit({ tipo: this.searchType, valor: this.searchValue });
  }

  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  toggleColumnas(): void {
    this.mostrarColumnas = !this.mostrarColumnas;
  }

  actualizarColumnas(): void {
    // Lógica para actualizar columnas visibles
  }

  aplicarFiltros(filtro?: string): void {
    this.filtroActivo = filtro || 'todos';
    this.filtrarEvent.emit({
      grupo: this.filtroGrupo,
      marca: this.filtroMarca,
      filtro: this.filtroActivo,
    });
  }

  exportar(): void {
    this.exportarEvent.emit();
  }

  importar(): void {
    this.importarEvent.emit();
  }

  agregar(): void {
    this.agregarEvent.emit();
  }
}
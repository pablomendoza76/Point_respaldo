import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  ChangeDetectionStrategy, 
  ChangeDetectorRef 
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

// ✅ Importar acciones desde tabla.actions.ts
import {
  setSearchTerm,
  setFiltroActivo,
  setFiltrosDinamicos,
  setColumnasVisibles
} from '../../state/tabla_NgRx/tabla.actions'; // <-- Cambiado

import { FiltroConfiguracion } from '../../state/Filtros_NgRx/filter.model'; // <- Puedes seguir usando el modelo de filtros si te sirve

@Component({
  selector: 'app-barra-busqueda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './barra-busqueda.component.html',
  styleUrls: ['./barra-busqueda.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarraBusquedaComponent {
  @Input() opcionesBusqueda: { value: string; label: string }[] = [];
  @Input() filtrosConfiguracion: FiltroConfiguracion[] = [];
  @Input() columnasDisponibles: { name: string; key: string; selected: boolean }[] = [];
  @Input() textoBotonAgregar: string = 'Agregar';

  @Output() filtrosAplicados = new EventEmitter<{ [key: string]: string }>();
  @Output() actualizarColumnasEvent = new EventEmitter<{ name: string; key: string; selected: boolean }[]>();

  searchType: string = '';
  searchValue: string = '';
  mostrarFiltros: boolean = false;
  mostrarColumnas: boolean = false;

  filtrosSeleccionados: { [key: string]: string } = {
    estado: 'todos'
  };

  private searchTermSubject = new Subject<string>();

  constructor(
    private store: Store,
    private cdr: ChangeDetectorRef
  ) {
    // Búsqueda con debounce
    this.searchTermSubject.pipe(debounceTime(500)).subscribe((searchTerm) => {
      this.store.dispatch(setSearchTerm({ searchTerm }));
    });
  }

  cambiarTipoBusqueda(): void {
    this.searchValue = '';
    this.actualizarBusqueda();
  }

  actualizarBusqueda(): void {
    this.searchTermSubject.next(this.searchValue);
  }

  aplicarFiltros(estado?: string): void {
    if (estado) {
      this.filtrosSeleccionados['estado'] = estado;
      this.store.dispatch(setFiltroActivo({ filtroActivo: estado }));
    }

    this.store.dispatch(setFiltrosDinamicos({ filtrosDinamicos: { ...this.filtrosSeleccionados } }));
    this.filtrosAplicados.emit({ ...this.filtrosSeleccionados });

    this.cdr.markForCheck();
  }

  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  toggleColumnas(): void {
    this.mostrarColumnas = !this.mostrarColumnas;
  }

  actualizarColumnas(): void {
    console.log('🔥 Columnas disponibles actualizadas:', this.columnasDisponibles);
  
    // Emitir al componente padre si lo necesitas
    this.actualizarColumnasEvent.emit(this.columnasDisponibles);
  
    // Solo las columnas seleccionadas (visibles)
    const columnasVisibles = this.columnasDisponibles
      .filter(col => col.selected)
      .map(col => ({
        name: col.name,
        key: col.key,
        selected: col.selected // ✅ Necesario para cumplir con el tipo esperado
      }));
  
    // Despachar al reducer de tabla
    this.store.dispatch(setColumnasVisibles({ columnasVisibles }));
  }
  

  limpiarFiltros(): void {
    this.filtrosSeleccionados = {};
    this.store.dispatch(setFiltrosDinamicos({ filtrosDinamicos: {} }));
    this.cdr.markForCheck();
  }

  exportar(): void {
    console.log('📥 Exportando datos...');
  }

  importar(): void {
    console.log('📤 Importando datos...');
  }

  agregar(): void {
    console.log('➕ Agregando nuevo elemento...');
  }
}

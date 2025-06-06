import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { FiltroConfiguracion } from '@stores/Filtros_NgRx/filter.model';
import { setColumnasVisibles, setFiltroActivo, setFiltrosDinamicos, setSearchTerm } from '@stores/tabla_NgRx/tabla.actions';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-barra-busqueda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './barra-busqueda.component.html',
  styleUrls: ['./barra-busqueda.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarraBusquedaComponent implements OnInit {
  /**
   * Lista de opciones de tipo de búsqueda.
   */
  @Input() opcionesBusqueda: { value: string; label: string }[] = [];

  /**
   * Configuración dinámica de filtros.
   */
  @Input() filtrosConfiguracion: FiltroConfiguracion[] = [];

  /**
   * Columnas disponibles para mostrar u ocultar.
   */
  @Input() columnasDisponibles: {
    name: string;
    key: string;
    selected: boolean;
  }[] = [];

  /**
   * Texto del botón de agregar.
   */
  @Input() textoBotonAgregar: string = 'Agregar';

  /**
   * Regula si se muestra solo la barra de búsqueda.
   */
  @Input() mostrarSoloBusqueda: boolean = false;

  /**
   * Controla si mostrar el botón Exportar.
   */
  @Input() habilitarExportar: boolean = false;

  /**
   * Controla si mostrar el botón Importar.
   */
  @Input() habilitarImportar: boolean = false;

  /**
   * Emite los filtros aplicados.
   */
  @Output() filtrosAplicados = new EventEmitter<{ [key: string]: string }>();

  /**
   * Emite la lista de columnas visibles actualizadas.
   */
  @Output() actualizarColumnasEvent = new EventEmitter<{ name: string; key: string; selected: boolean }[]>();

  /**
   * Emite evento para indicar que se desea agregar un nuevo registro.
   */
  @Output() agregar = new EventEmitter<void>();

  searchType: string = '';
  searchValue: string = '';
  mostrarFiltros: boolean = false;
  mostrarColumnas: boolean = false;

  filtrosSeleccionados: { [key: string]: any } = {
    estado: 'todos',
  };

  private searchTermSubject = new Subject<string>();

  constructor(private store: Store, private cdr: ChangeDetectorRef) {
    this.searchTermSubject.pipe(debounceTime(500)).subscribe((searchTerm) => {
      this.store.dispatch(setSearchTerm({ searchTerm }));
    });
  }

  ngOnInit(): void {
    if (!this.searchType && this.opcionesBusqueda.length > 0) {
      this.searchType = this.opcionesBusqueda[0].value;
      this.actualizarBusqueda();
    }
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

    const filtrosTransformados: { [key: string]: string } = {};
    Object.entries(this.filtrosSeleccionados).forEach(([claveUI, valor]) => {
      if (claveUI === 'estado' && valor === 'todos') return;

      const config = this.filtrosConfiguracion.find((f) => f.nombre === claveUI);
      const claveReal = config?.key || claveUI.toLowerCase();

      const valorTransformado = valor && typeof valor === 'object' ? valor.id ?? valor.valor : valor;
      filtrosTransformados[claveReal] = valorTransformado;
    });

    this.store.dispatch(setFiltrosDinamicos({ filtrosDinamicos: filtrosTransformados }));
    this.filtrosAplicados.emit({ ...filtrosTransformados });
    this.cdr.markForCheck();
  }

  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  toggleColumnas(): void {
    this.mostrarColumnas = !this.mostrarColumnas;
  }

  actualizarColumnas(): void {
    const columnasActualizadas = this.columnasDisponibles.map((col) => ({ ...col }));
    this.actualizarColumnasEvent.emit(columnasActualizadas);

    const columnasVisibles = columnasActualizadas
      .filter((col) => col.selected)
      .map((col) => ({
        name: col.name,
        key: col.key,
        selected: col.selected,
      }));

    this.store.dispatch(setColumnasVisibles({ columnasVisibles }));
  }

  limpiarFiltros(): void {
    this.filtrosSeleccionados = {};
    this.store.dispatch(setFiltrosDinamicos({ filtrosDinamicos: {} }));
    this.cdr.markForCheck();
  }

  exportar(): void {
    if (!this.habilitarExportar) return;

    const tabla = document.querySelector('table');
    if (!tabla) {
      console.warn('No se encontró la tabla para exportar.');
      return;
    }

    const hoja: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tabla);
    const libro: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Productos');
    XLSX.writeFile(libro, 'productos.xlsx');
  }

  importar(): void {
    if (!this.habilitarImportar) return;
    console.log('Importando datos...');
  }

  agregarRegistro(): void {
    this.agregar.emit();
  }

  /**
   * para guardar y mostrar que columanas ver 
   * @param columna 
   * @param checked, valida si esta selecionado o no 
   */
  onSeleccionarColumna(columna: any, event: Event): void {
    const checked = (event.target as HTMLInputElement)?.checked ?? false

    const columnasActualizadas = this.columnasDisponibles.map((col) => (col.key === columna.key ? { ...col, selected: checked } : { ...col }))

    this.actualizarColumnasEvent.emit(columnasActualizadas)

    const columnasVisibles = columnasActualizadas.filter((c) => c.selected).map((c) => ({ name: c.name, key: c.key, selected: c.selected }))

    this.store.dispatch(setColumnasVisibles({ columnasVisibles }))
  }
}

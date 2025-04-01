import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import {
  setSearchTerm,
  setFiltroActivo,
  setFiltrosDinamicos,
  setColumnasVisibles,
} from '../../state/tabla_NgRx/tabla.actions';
import { FiltroConfiguracion } from '../../state/Filtros_NgRx/filter.model';
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
   * Define la relación entre el label del filtro y su clave interna real.
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
   * Evento que emite los filtros aplicados.
   */
  @Output() filtrosAplicados = new EventEmitter<{ [key: string]: string }>();

  /**
   * Evento que emite cuando se actualizan las columnas visibles.
   */
  @Output() actualizarColumnasEvent = new EventEmitter<
    { name: string; key: string; selected: boolean }[]
  >();

  searchType: string = '';
  searchValue: string = '';
  mostrarFiltros: boolean = false;
  mostrarColumnas: boolean = false;

  /**
   * Objeto que contiene los filtros actualmente seleccionados.
   * Las claves son los labels visibles (que serán transformados).
   */
  filtrosSeleccionados: { [key: string]: string } = {
    estado: 'todos',
  };

  private searchTermSubject = new Subject<string>();

  constructor(private store: Store, private cdr: ChangeDetectorRef) {
    // Búsqueda con debounce
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

  /**
   * Cambia el tipo de búsqueda y limpia el valor.
   */
  cambiarTipoBusqueda(): void {
    this.searchValue = '';
    this.actualizarBusqueda();
  }

  /**
   * Despacha el término de búsqueda al store.
   */
  actualizarBusqueda(): void {
    this.searchTermSubject.next(this.searchValue);
  }

  /**
   * Aplica los filtros actuales transformando las claves visibles
   * a las claves internas reales usando filtrosConfiguracion.
   */
  aplicarFiltros(estado?: string): void {
    if (estado) {
      this.filtrosSeleccionados['estado'] = estado;
      this.store.dispatch(setFiltroActivo({ filtroActivo: estado }));
    }

    // Transformar las claves visibles a claves reales
    const filtrosTransformados: { [key: string]: string } = {};
    Object.entries(this.filtrosSeleccionados).forEach(([claveUI, valor]) => {
      // Omitir el estado 'todos' de los filtros dinámicos
      if (claveUI === 'estado' && valor === 'todos') return;

      const config = this.filtrosConfiguracion.find(
        (f) => f.nombre === claveUI
      );

      const claveReal = config?.key || claveUI.toLowerCase();
      filtrosTransformados[claveReal] = valor;
    });

    this.store.dispatch(
      setFiltrosDinamicos({ filtrosDinamicos: filtrosTransformados })
    );
    this.filtrosAplicados.emit({ ...filtrosTransformados });

    this.cdr.markForCheck();
  }

  /**
   * Muestra u oculta la sección de filtros.
   */
  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  /**
   * Muestra u oculta el panel de columnas visibles.
   */
  toggleColumnas(): void {
    this.mostrarColumnas = !this.mostrarColumnas;
  }

  /**
   * Despacha las columnas seleccionadas como visibles.
   */
  actualizarColumnas(): void {
    console.log(
      '🔥 Columnas disponibles actualizadas:',
      this.columnasDisponibles
    );

    this.actualizarColumnasEvent.emit(this.columnasDisponibles);

    const columnasVisibles = this.columnasDisponibles
      .filter((col) => col.selected)
      .map((col) => ({
        name: col.name,
        key: col.key,
        selected: col.selected,
      }));

    this.store.dispatch(setColumnasVisibles({ columnasVisibles }));
  }

  /**
   * Limpia todos los filtros dinámicos.
   */
  limpiarFiltros(): void {
    this.filtrosSeleccionados = {};
    this.store.dispatch(setFiltrosDinamicos({ filtrosDinamicos: {} }));
    this.cdr.markForCheck();
  }

  /**
   * Lógica para exportar datos.
   */
  exportar(): void {
    const tabla = document.querySelector('table'); // Asegúrate que tu tabla visible tenga una etiqueta <table>
    if (!tabla) {
      console.warn('⚠️ No se encontró la tabla para exportar.');
      return;
    }

    const hoja: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tabla);
    const libro: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Productos');

    XLSX.writeFile(libro, 'productos.xlsx');
  }

  /**
   * Lógica para importar datos.
   */
  importar(): void {
    console.log('📤 Importando datos...');
  }

  /**
   * Lógica para agregar un nuevo elemento.
   */
  agregar(): void {
    console.log('➕ Agregando nuevo elemento...');
  }
}

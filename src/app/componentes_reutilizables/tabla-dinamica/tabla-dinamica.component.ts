import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AppState } from '../../state/tabla_NgRx/tabla.state';
import {
  selectProductosVisibles,
  selectTotalRegistros
} from '../../state/tabla_NgRx/tabla.selectors';
import {
  setPaginaActual,
  setItemsPorPagina
} from '../../state/tabla_NgRx/tabla.actions';

@Component({
  selector: 'app-tabla-dinamica',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-dinamica.component.html',
  styleUrls: ['./tabla-dinamica.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablaDinamicaComponent implements OnInit {
  /**
   * Observable de productos visibles filtrados desde el store.
   */
  productosVisibles$: Observable<any[]>;

  /**
   * Observable del total de registros, para paginación.
   */
  totalRegistros$: Observable<number>;

  /**
   * Observable de columnas visibles sincronizadas desde el store.
   */
  columnasVisibles$: Observable<{ name: string; key: string }[]>;

  /**
   * Página actual para la paginación.
   */
  paginaActual = 1;

  /**
   * Número de elementos a mostrar por página.
   */
  itemsPorPagina = 10;

  /**
   * Total de registros actuales tras aplicar filtros.
   */
  totalRegistros: number = 0;

  /**
   * Evento emitido cuando se edita un producto.
   */
  @Output() editarProducto = new EventEmitter<any>();

  /**
   * Evento emitido cuando se elimina un producto.
   */
  @Output() eliminarProducto = new EventEmitter<any>();

  /**
   * Objeto Math expuesto al template para operaciones matemáticas.
   */
  math = Math;

  /**
   * Constructor del componente.
   * @param store Store global de NgRx.
   */
  constructor(private store: Store<AppState>) {
    // Productos visibles ya procesados con filtros, columnas y paginación
    this.productosVisibles$ = this.store.pipe(select(selectProductosVisibles));

    // Total de registros después de filtros
    this.totalRegistros$ = this.store.pipe(select(selectTotalRegistros));

    // Columnas visibles sincronizadas directamente desde el store
    this.columnasVisibles$ = this.store.pipe(select(state => state.tabla.columnasVisibles));

    // Suscripción directa al total para uso en el template
    this.totalRegistros$.subscribe(total => {
      this.totalRegistros = total || 0;
    });
  }

  /**
   * Inicialización del componente.
   */
  ngOnInit(): void {}

  /**
   * Emite evento para editar un producto.
   * @param producto Producto seleccionado.
   */
  onEditarProducto(producto: any): void {
    this.editarProducto.emit(producto);
  }

  /**
   * Emite evento para eliminar un producto.
   * @param producto Producto seleccionado.
   */
  onEliminarProducto(producto: any): void {
    this.eliminarProducto.emit(producto);
  }

  /**
   * Cambia la página actual y la actualiza en el store.
   * @param pagina Página nueva seleccionada.
   */
  cambiarPagina(pagina: number): void {
    if (pagina >= 1) {
      this.paginaActual = pagina;
      this.store.dispatch(setPaginaActual({ paginaActual: pagina }));
    }
  }

  /**
   * Cambia la cantidad de elementos por página y la actualiza en el store.
   * @param event Evento del elemento select.
   */
  cambiarItemsPorPagina(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const cantidad = selectElement.value;
    const valor = cantidad === 'todos' ? 20000 : Number(cantidad);
    this.itemsPorPagina = valor;
    this.store.dispatch(setItemsPorPagina({ itemsPorPagina: valor }));
  }
}

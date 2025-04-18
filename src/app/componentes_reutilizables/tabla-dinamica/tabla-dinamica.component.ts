/**
 * Componente que representa una tabla dinámica con paginación y eliminación de registros.
 */
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AppState } from '../../state/tabla_NgRx/tabla.state';
import {
  selectProductosVisibles,
  selectTotalRegistros
} from '../../state/tabla_NgRx/tabla.selectors';
import {
  setPaginaActual,
  setItemsPorPagina,
  eliminarProducto
} from '../../state/tabla_NgRx/tabla.actions';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';

@Component({
  selector: 'app-tabla-dinamica',
  standalone: true,
  imports: [CommonModule, DeleteModalComponent],
  templateUrl: './tabla-dinamica.component.html',
  styleUrls: ['./tabla-dinamica.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablaDinamicaComponent implements OnInit, OnDestroy {
  /** Página actual para paginación */
  @Input() paginaActual = 1;

  /** Registros por página */
  @Input() itemsPorPagina = 10;

  /** Opciones para los valores de paginación (recibidas desde el componente padre) */
  @Input() opcionesPaginacion: { value: string | number; label: string }[] = [];

  /** Evento emitido al hacer clic en editar un registro */
  @Output() editarRegistro = new EventEmitter<any>();

  /** Evento emitido cuando cambia la página */
  @Output() cambioPagina = new EventEmitter<number>();

  /** Evento emitido cuando cambia la cantidad de ítems por página */
  @Output() cambioItemsPorPagina = new EventEmitter<number>();

  /** Registros actuales visibles */
  registrosActuales: any[] = [];

  /** Math helper para usar en plantilla */
  math = Math;

  /** Observable con los registros visibles desde el store */
  registrosVisibles$: Observable<any[]>;

  /** Observable con el total de registros desde el store */
  totalRegistros$: Observable<number>;

  /** Observable con las columnas visibles desde el store */
  columnasVisibles$: Observable<{ name: string; key: string }[]>;

  /** Total de registros en la tabla */
  totalRegistros = 0;

  /** Registro a eliminar mediante el modal */
  registroAEliminar: any = null;

  /** Controla la visibilidad del modal de eliminación */
  mostrarModalEliminar = false;

  /** Subscripciones activas */
  private subs = new Subscription();

  /**
   * Constructor que inyecta el store y el detector de cambios.
   * @param store Store global de la aplicación
   * @param cdr Detector de cambios para forzar renderización
   */
  constructor(private store: Store<AppState>, private cdr: ChangeDetectorRef) {
    this.registrosVisibles$ = this.store.pipe(select(selectProductosVisibles));
    this.totalRegistros$ = this.store.pipe(select(selectTotalRegistros));
    this.columnasVisibles$ = this.store.pipe(select(state => state.tabla.columnasVisibles));
  }

  /**
   * Inicializa el componente y suscribe a los datos del store.
   */
  ngOnInit(): void {
    this.subs.add(
      this.registrosVisibles$.subscribe(registros => {
        this.registrosActuales = registros || [];
        this.cdr.markForCheck();
      })
    );

    this.subs.add(
      this.totalRegistros$.subscribe(total => {
        this.totalRegistros = total || 0;
        this.cdr.markForCheck();
      })
    );
  }

  /**
   * Limpia las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /**
   * Emite el producto a editar hacia el componente padre.
   * @param registro Registro reducido a editar
   */
  onEditarRegistro(registro: any): void {
    this.editarRegistro.emit(registro);
  }

  /**
   * Abre el modal de eliminación para el registro dado.
   * @param registro Registro a eliminar
   */
  onEliminarRegistro(registro: any): void {
    this.registroAEliminar = registro;
    this.mostrarModalEliminar = true;
    this.cdr.markForCheck();
  }

  /**
   * Cancela y cierra el modal de eliminación.
   */
  cancelarEliminacion(): void {
    this.mostrarModalEliminar = false;
    this.registroAEliminar = null;
    this.cdr.markForCheck();
  }

  /**
   * Confirma y ejecuta la eliminación del registro.
   */
  confirmarEliminacion(): void {
    if (this.registroAEliminar) {
      this.store.dispatch(eliminarProducto({ producto: this.registroAEliminar }));
      this.cancelarEliminacion();
    }
  }

  /**
   * Cambia la página actual mostrada en la tabla y emite el nuevo valor al padre.
   * @param pagina Nueva página
   */
  cambiarPagina(pagina: number): void {
    if (pagina >= 1) {
      this.paginaActual = pagina;
      this.store.dispatch(setPaginaActual({ paginaActual: pagina }));
      this.cambioPagina.emit(pagina);
    }
  }

  /**
   * Cambia el número de ítems visibles por página y emite el nuevo valor al padre.
   * @param event Evento del selector de cantidad
   */
  cambiarItemsPorPagina(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const cantidad = selectElement.value;
    const valor = cantidad === 'todos' ? 20000 : Number(cantidad);
    this.itemsPorPagina = valor;
    this.store.dispatch(setItemsPorPagina({ itemsPorPagina: valor }));
    this.cambioItemsPorPagina.emit(valor);
  }

  /**
   * Optimización para ngFor usando el código del producto como identificador.
   * @param index Índice del elemento
   * @param item Registro
   * @returns Código del producto
   */
  trackByCodigo(index: number, item: any): string {
    return item.codigo;
  }
}

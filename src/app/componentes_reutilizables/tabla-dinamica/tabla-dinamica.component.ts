import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  SimpleChanges
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
  eliminarProducto,
  setProductos
} from '../../state/tabla_NgRx/tabla.actions';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { FormularioDinamicoLoaderComponent } from '../formulario-dinamico-loader/formulario-dinamico-loader.component';

/**
 * Componente que representa una tabla dinámica con paginación, edición y eliminación de registros.
 */
@Component({
  selector: 'app-tabla-dinamica',
  standalone: true,
  imports: [CommonModule, DeleteModalComponent, FormularioDinamicoLoaderComponent],
  templateUrl: './tabla-dinamica.component.html',
  styleUrls: ['./tabla-dinamica.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablaDinamicaComponent implements OnInit, OnDestroy, OnChanges {
  /** Registro a eliminar mediante el modal */
  registroAEliminar: any = null;

  /** Registro actualmente cargado en el formulario de edición */
  registroEnFormulario: any = null;

  /** Controla la visibilidad del modal de eliminación */
  mostrarModalEliminar = false;

  /** Controla si el formulario dinámico está visible */
  mostrarFormulario = false;

  /** Página actual para paginación */
  paginaActual = 1;

  /** Registros por página */
  itemsPorPagina = 10;

  /** Total de registros en la tabla */
  totalRegistros = 0;

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

  /** Subscripciones activas */
  private subs = new Subscription();

  /** Producto a editar recibido desde el componente padre */
  @Input() productoEditar: any = null;

  /** Bloques estructurados para el formulario dinámico */
  @Input() bloques: Array<{ titulo: string; campos: any[] }> = [];

  /** Evento emitido al hacer clic en editar un registro */
  @Output() editarRegistro = new EventEmitter<any>();

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

    console.log('[TablaDinamica] productoEditar recibido:', this.productoEditar);
    console.log('[TablaDinamica] bloques recibidos:', this.bloques);
  }

  /**
   * Detecta cambios en los inputs como el producto a editar y los bloques del formulario.
   * @param changes Cambios detectados en los @Input del componente
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productoEditar'] && this.productoEditar && this.bloques?.length) {
      this.registroEnFormulario = { ...this.productoEditar };
      this.mostrarFormulario = true;
      console.log('[TablaDinamica] Producto para editar:', this.registroEnFormulario);
      console.log('[TablaDinamica] Bloques enviados al formulario:', this.bloques);
      this.cdr.markForCheck();
    }
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
   * Cierra el formulario dinámico sin guardar cambios.
   */
  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.registroEnFormulario = null;
    this.cdr.markForCheck();
  }

  /**
   * Guarda los cambios del formulario y actualiza el estado global.
   * @param registro Registro actualizado
   */
  guardarRegistro(registro: any): void {
    const nuevosRegistros = this.registrosActuales.map(r =>
      r.codigo === registro.codigo ? registro : r
    );
    this.store.dispatch(setProductos({ productos: nuevosRegistros }));
    this.cancelarFormulario();
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
   * Cambia la página actual mostrada en la tabla.
   * @param pagina Nueva página
   */
  cambiarPagina(pagina: number): void {
    if (pagina >= 1) {
      this.paginaActual = pagina;
      this.store.dispatch(setPaginaActual({ paginaActual: pagina }));
    }
  }

  /**
   * Cambia el número de ítems visibles por página.
   * @param event Evento del selector de cantidad
   */
  cambiarItemsPorPagina(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const cantidad = selectElement.value;
    const valor = cantidad === 'todos' ? 20000 : Number(cantidad);
    this.itemsPorPagina = valor;
    this.store.dispatch(setItemsPorPagina({ itemsPorPagina: valor }));
  }

  /**
   * Ejecuta una acción personalizada desde el formulario.
   * @param accion Nombre de la acción
   */
  manejarAccion(accion: string): void {
    if (accion === 'cancelar') {
      this.cancelarFormulario();
    }
  }

  /**
   * Cierra el formulario dinámico desde el evento cerrado.
   */
  onCerrarFormulario(): void {
    this.cancelarFormulario();
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

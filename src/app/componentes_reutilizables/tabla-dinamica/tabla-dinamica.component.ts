// tabla-dinamica.component.ts
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy
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

@Component({
  selector: 'app-tabla-dinamica',
  standalone: true,
  imports: [CommonModule, DeleteModalComponent, FormularioDinamicoLoaderComponent],
  templateUrl: './tabla-dinamica.component.html',
  styleUrls: ['./tabla-dinamica.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablaDinamicaComponent implements OnInit, OnDestroy {
  /**
   * Campos disponibles en el formulario dinámico.
   */
  camposFormulario = [
    { key: 'codigo', label: 'Código', tipo: 'text', required: true },
    { key: 'nombre', label: 'Nombre', tipo: 'text', required: true },
    { key: 'precio', label: 'Precio', tipo: 'number' },
    { key: 'stock', label: 'Stock', tipo: 'number' },
    { key: 'categoria', label: 'Categoría', tipo: 'text' },
    { key: 'marca', label: 'Marca', tipo: 'text' }
  ];

  /** Registro a eliminar mediante el modal */
  registroAEliminar: any = null;

  /** Registro actualmente cargado en el formulario de edición */
  registroEnFormulario: any = null;

  /** Controla la visibilidad del modal de eliminación */
  mostrarModalEliminar: boolean = false;

  /** Controla si el formulario dinámico está visible */
  mostrarFormulario: boolean = false;

  /** Página actual para paginación */
  paginaActual = 1;

  /** Registros por página */
  itemsPorPagina = 10;

  /** Total de registros en la tabla */
  totalRegistros = 0;

  /** Registros actuales visibles */
  registrosActuales: any[] = [];

  /** Math para uso en plantilla */
  math = Math;

  /** Observables desde NgRx */
  registrosVisibles$: Observable<any[]>;
  totalRegistros$: Observable<number>;
  columnasVisibles$: Observable<{ name: string; key: string }[]>;

  /** Subscripciones activas */
  private subs = new Subscription();

  constructor(private store: Store<AppState>, private cdr: ChangeDetectorRef) {
    this.registrosVisibles$ = this.store.pipe(select(selectProductosVisibles));
    this.totalRegistros$ = this.store.pipe(select(selectTotalRegistros));
    this.columnasVisibles$ = this.store.pipe(select(state => state.tabla.columnasVisibles));
  }

  /**
   * Inicializa el componente y las suscripciones necesarias.
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
   * Abre el formulario de edición con el registro seleccionado.
   * @param registro Registro a editar
   */
  onEditarRegistro(registro: any): void {
    console.log('Editando registro:', registro); // Verifica si se ejecuta
    this.registroEnFormulario = { ...registro }; // Copia el registro
    this.mostrarFormulario = true;              // Muestra el formulario directamente
    this.cdr.markForCheck();                    // Marca el componente para revisión
  }
  /**
   * Cierra el formulario dinámico sin guardar.
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
   * Cierra el formulario dinámico desde el evento `closed`.
   */
  onCerrarFormulario(): void {
    this.cancelarFormulario();
  }

  /**
   * TrackBy para *ngFor optimizado.
   * @param index Índice del elemento
   * @param item Registro
   * @returns Identificador único
   */
  trackByCodigo(index: number, item: any): string {
    return item.codigo;
  }
}

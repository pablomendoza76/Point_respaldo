// tabla-dinamica.component.ts
import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
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
   * Lista de campos del formulario que se utilizarán para edición o creación.
   */
  camposFormulario = [
    { key: 'codigo', label: 'Código', tipo: 'text', required: true },
    { key: 'nombre', label: 'Nombre', tipo: 'text', required: true },
    { key: 'precio', label: 'Precio', tipo: 'number' },
    { key: 'stock', label: 'Stock', tipo: 'number' },
    { key: 'categoria', label: 'Categoría', tipo: 'text' },
    { key: 'marca', label: 'Marca', tipo: 'text' }
  ];

  /** Registro marcado para eliminación */
  registroAEliminar: any = null;

  /** Registro actual cargado en el formulario para edición */
  registroEnFormulario: any = null;

  /** Controla visibilidad del modal de eliminación */
  mostrarModalEliminar: boolean = false;

  /** Controla visibilidad del formulario de edición */
  isFormularioAbierto: boolean = false;

  /** Referencia global a Math para uso en plantilla */
  math = Math;

  /** Página actual seleccionada */
  paginaActual = 1;

  /** Cantidad de registros por página */
  itemsPorPagina = 10;

  /** Total de registros visibles tras filtros */
  totalRegistros = 0;

  /** Copia local de los registros visibles */
  registrosActuales: any[] = [];

  /** Registros visibles desde el store */
  registrosVisibles$: Observable<any[]>;

  /** Total de registros desde el store */
  totalRegistros$: Observable<number>;

  /** Columnas visibles desde el store */
  columnasVisibles$: Observable<{ name: string; key: string }[]>;

  /** Subscripción única para limpieza y control */
  private subs = new Subscription();

  constructor(private store: Store<AppState>, private cdr: ChangeDetectorRef) {
    this.registrosVisibles$ = this.store.pipe(select(selectProductosVisibles));
    this.totalRegistros$ = this.store.pipe(select(selectTotalRegistros));
    this.columnasVisibles$ = this.store.pipe(select(state => state.tabla.columnasVisibles));
    
  }

  /** Inicializa las suscripciones a observables */
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

  /** Limpia las suscripciones activas al destruir el componente */
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /**
   * Activa el formulario dinámico con el registro seleccionado
   * @param registro Registro a editar
   */
  onEditarRegistro(registro: any): void {
    this.registroEnFormulario = { ...registro };
    this.isFormularioAbierto = true;
    this.cdr.markForCheck(); // Forzar detección de cambios
  }
  

  /** Cierra el formulario dinámico sin guardar cambios */
  cancelarFormulario(): void {
    this.isFormularioAbierto = false;
    this.registroEnFormulario = null;
    this.cdr.markForCheck();
  }

  /**
   * Guarda el registro editado y actualiza el store
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
   * Abre el modal de confirmación para eliminar un registro
   * @param registro Registro a eliminar
   */
  onEliminarRegistro(registro: any): void {
    this.registroAEliminar = registro;
    this.mostrarModalEliminar = true;
    this.cdr.markForCheck();
  }

  /** Cierra el modal de eliminación sin eliminar */
  cancelarEliminacion(): void {
    this.mostrarModalEliminar = false;
    this.registroAEliminar = null;
    this.cdr.markForCheck();
  }

  /** Elimina el registro seleccionado y actualiza el store */
  confirmarEliminacion(): void {
    if (this.registroAEliminar) {
      this.store.dispatch(eliminarProducto({ producto: this.registroAEliminar }));
      this.cancelarEliminacion();
    }
  }

  /**
   * Cambia la página actual mostrada en la tabla
   * @param pagina Número de página a mostrar
   */
  cambiarPagina(pagina: number): void {
    if (pagina >= 1) {
      this.paginaActual = pagina;
      this.store.dispatch(setPaginaActual({ paginaActual: pagina }));
    }
  }

  /**
   * Cambia la cantidad de ítems visibles por página
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
   * Ejecuta acciones personalizadas desde el formulario dinámico
   * @param accion Acción emitida desde el formulario
   */
  manejarAccion(accion: string): void {
    if (accion === 'cancelar') {
      this.cancelarFormulario();
    }
  }

  /**
 * Maneja el cierre del formulario
 */
onCerrarFormulario(): void {
  this.isFormularioAbierto = false;
  this.registroEnFormulario = null;
  this.cdr.markForCheck();
}

/**
 * Función trackBy para optimizar rendimiento
 */
trackByCodigo(index: number, item: any): string {
  return item.codigo;
}
}

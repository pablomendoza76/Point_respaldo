/**
 * Componente que representa una tabla dinámica con paginación y eliminación de registros.
 */
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { Store, select } from '@ngrx/store'
import { DeleteModalComponent } from '@reusables/delete-modal/delete-modal.component'
import { eliminarProducto, setItemsPorPagina, setPaginaActual } from '@stores/tabla_NgRx/tabla.actions'
import { selectProductosVisibles, selectTotalRegistros } from '@stores/tabla_NgRx/tabla.selectors'
import { AppState } from '@stores/tabla_NgRx/tabla.state'
import { Observable, Subscription } from 'rxjs'

@Component({
  selector: 'app-tabla-dinamica',
  standalone: true,
  imports: [CommonModule, DeleteModalComponent],
  templateUrl: './tabla-dinamica.component.html',
  styleUrls: ['./tabla-dinamica.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablaDinamicaComponent implements OnInit, OnDestroy {
  /** Página actual para paginación */
  @Input() paginaActual = 1

  /** Registros por página */
  @Input() itemsPorPagina = 10

  /** Opciones para los valores de paginación (recibidas desde el componente padre) */
  @Input() opcionesPaginacion: { value: string | number; label: string }[] = []

  /** Evento emitido al hacer clic en editar un registro */
  @Output() editarRegistro = new EventEmitter<any>()

  /** Evento emitido cuando cambia la página */
  @Output() cambioPagina = new EventEmitter<number>()

  /** Evento emitido cuando cambia la cantidad de ítems por página */
  @Output() cambioItemsPorPagina = new EventEmitter<number>()

  /** Registros actuales visibles */
  registrosActuales: any[] = []

  /** Math helper para usar en plantilla */
  math = Math

  /** Observable con los registros visibles desde el store */
  registrosVisibles$: Observable<any[]>

  /** Observable con el total de registros desde el store */
  totalRegistros$: Observable<number>

  /** Observable con las columnas visibles desde el store */
  columnasVisibles$: Observable<{ name: string; key: string }[]>

  /** Total de registros en la tabla */
  totalRegistros = 0

  /** Registro a eliminar mediante el modal */
  registroAEliminar: any = null

  /** Controla la visibilidad del modal de eliminación */
  mostrarModalEliminar = false

  /** Subscripciones activas */
  private subs = new Subscription()

  /**
   * Constructor que inyecta el store y el detector de cambios.
   * @param store Store global de la aplicación
   * @param cdr Detector de cambios para forzar renderización
   */
  constructor(private store: Store<AppState>, private cdr: ChangeDetectorRef) {
    this.registrosVisibles$ = this.store.pipe(select(selectProductosVisibles))
    this.totalRegistros$ = this.store.pipe(select(selectTotalRegistros))
    this.columnasVisibles$ = this.store.pipe(select((state) => state.tabla.columnasVisibles))
  }

  /**
   * Inicializa el componente y suscribe a los datos del store.
   */
  ngOnInit(): void {
    this.subs.add(
      this.registrosVisibles$.subscribe((registros) => {
        this.registrosActuales = registros || []
        this.cdr.markForCheck()
      }),
    )

    this.subs.add(
      this.totalRegistros$.subscribe((total) => {
        this.totalRegistros = total || 0
        this.cdr.markForCheck()
      }),
    )
  }

  /**
   * Limpia las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  /**
   * Emite el producto a editar hacia el componente padre.
   * @param registro Registro reducido a editar
   */
  onEditarRegistro(registro: any): void {
    this.editarRegistro.emit(registro)
  }

  /**
   * Abre el modal de eliminación para el registro dado.
   * @param registro Registro a eliminar
   */
  onEliminarRegistro(registro: any): void {
    this.registroAEliminar = registro
    this.mostrarModalEliminar = true
    this.cdr.markForCheck()
  }

  /**
   * Cancela y cierra el modal de eliminación.
   */
  cancelarEliminacion(): void {
    this.mostrarModalEliminar = false
    this.registroAEliminar = null
    this.cdr.markForCheck()
  }

  /**
   * Confirma y ejecuta la eliminación del registro.
   */
  confirmarEliminacion(): void {
    if (this.registroAEliminar) {
      this.store.dispatch(eliminarProducto({ producto: this.registroAEliminar }))
      this.cancelarEliminacion()
    }
  }

  /**
   * Cambia la página actual mostrada en la tabla y emite el nuevo valor al padre.
   * @param pagina Nueva página
   */
  cambiarPagina(pagina: number): void {
    if (pagina >= 1) {
      this.paginaActual = pagina
      this.store.dispatch(setPaginaActual({ paginaActual: pagina }))
      this.cambioPagina.emit(pagina)
    }
  }

  /**
   * Cambia el número de ítems visibles por página y emite el nuevo valor al padre.
   * @param event Evento del selector de cantidad
   */
  cambiarItemsPorPagina(event: Event): void {
    const selectElement = event.target as HTMLSelectElement
    const cantidad = selectElement.value
    const valor = cantidad === 'todos' ? 20000 : Number(cantidad)
    this.itemsPorPagina = valor
    this.store.dispatch(setItemsPorPagina({ itemsPorPagina: valor }))
    this.cambioItemsPorPagina.emit(valor)
  }

  /**
   * Optimización para ngFor usando el código del producto como identificador.
   * @param index Índice del elemento
   * @param item Registro
   * @returns Código del producto
   */
  trackByCodigo(index: number, item: any): string {
    return item.codigo
  }
 /**
 * Devuelve ícono, clase y texto en base al stockactual, min y max.
 * Se evalúa directamente en el componente sin tocar el store.
 */
 getIconoStockVisual(
  stockactual: string | number,
  min: string | number,
  max: string | number
): { icono: string; clase: string; texto: string } {
  const stock = parseFloat(stockactual as string) || 0;
  const stockMin = parseFloat(min as string) || 0;
  const stockMax = parseFloat(max as string) || 0;
  const promedio = (stockMin + stockMax) / 2;
    
  if (stock <= 0) {
    return {
      icono: 'fas fa-times-circle',
      clase: 'icon-danger',
      texto: 'Sin stock'
    };
  }

  if (stock > 0 && stock < promedio) {
    return {
      icono: 'fas fa-exclamation-triangle',
      clase: 'icon-warning',
      texto: 'Stock bajo'
    };
  }


  return {
    icono: 'fas fa-check-circle',
    clase: 'icon-ok',
    texto: 'Stock suficiente'
  };
}
}

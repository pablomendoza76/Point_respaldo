/**
 * Componente que gestiona la vista de marcas.
 * Permite listar, crear y editar marcas utilizando un formulario dinámico y una tabla con paginación.
 */
import { CommonModule } from '@angular/common'
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MarcasService } from '@modules/administracion/services/productos_services/marcas.service'
import { Store, select } from '@ngrx/store'
import { BarraBusquedaComponent } from '@reusables/barra-busqueda/barra-busqueda.component'
import { BarraUbicacionComponent } from '@reusables/barra-ubicacion/barra-ubicacion.component'
import { FormularioDinamicoLoaderComponent } from '@reusables/formulario-dinamico-loader/formulario-dinamico-loader.component'
import { TablaDinamicaComponent } from '@reusables/tabla-dinamica/tabla-dinamica.component'
import { setColumnasVisibles, setProductos, setTotalRegistros } from '@stores/tabla_NgRx/tabla.actions'
import { selectProductos } from '@stores/tabla_NgRx/tabla.selectors'
import { AppState } from '@stores/tabla_NgRx/tabla.state'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-vista-marcas',
  standalone: true,
  imports: [CommonModule, FormsModule, BarraUbicacionComponent, BarraBusquedaComponent, TablaDinamicaComponent, FormularioDinamicoLoaderComponent],
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MarcasComponent implements OnInit {
  /** Columnas visibles de la tabla de marcas */
  columnasVisibles$!: Observable<any[]>

  /** Registros visibles de marcas (almacenados en el store) */
  registrosVisibles$!: Observable<any[]>

  /** Marca seleccionada para edición o creación */
  marcaSeleccionada: any = null

  /** Controla si el formulario está visible */
  formularioVisible = false

  /** Indica si el formulario está en modo edición o creación */
  modoEdicion = true

  /** Estructura de bloques del formulario dinámico */
  bloquesFormulario: any[] = []

  /** Página actual seleccionada */
  paginaActual = 1

  /** Cantidad de ítems por página */
  itemsPorPagina = 10

  /** Total de registros disponibles */
  totalRegistros = 0

  /** Opciones disponibles para la paginación */
  opcionesPaginacion = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 20000, label: 'Todos' },
  ]

  /**
   * Constructor del componente de marcas
   * @param marcaService Servicio para obtener y crear marcas
   * @param store Store de la aplicación para manejar estado global
   */
  constructor(private marcaService: MarcasService, private store: Store<AppState>) {
    this.registrosVisibles$ = this.store.pipe(select(selectProductos))
  }

  /**
   * Inicializa el componente cargando marcas desde el servicio.
   */
  ngOnInit(): void {
    this.cargarMarcas()
  }

  /**
   * Carga las marcas desde el servicio y actualiza el store con productos, columnas visibles y total.
   */
  cargarMarcas(): void {
    this.marcaService.getMarcas().subscribe((marcas) => {
      this.store.dispatch(setProductos({ productos: marcas }))
      this.totalRegistros = marcas.length

      if (marcas.length > 0) {
        const columnas = Object.keys(marcas[0]).map((key) => ({
          key,
          name: this.capitalizar(key),
          selected: true,
        }))
        this.store.dispatch(setColumnasVisibles({ columnasVisibles: columnas }))
        this.store.dispatch(setTotalRegistros({ total: marcas.length }))
      }
    })
  }

  /**
   * Abre el formulario en modo creación con campos vacíos.
   */
  onAgregarNuevaMarca(): void {
    this.modoEdicion = false
    this.marcaSeleccionada = { nombre: '', descripcion: '' }
    this.bloquesFormulario = this.generarBloquesFormulario('Nueva Marca')
    this.formularioVisible = true
  }

  /**
   * Abre el formulario en modo edición con los datos de la marca seleccionada.
   * @param marca Marca a editar
   */
  onEditarMarca(marca: any): void {
    this.modoEdicion = true
    this.marcaSeleccionada = { ...marca }
    this.bloquesFormulario = this.generarBloquesFormulario('Editar Marca')
    this.formularioVisible = true
  }

  /**
   * Guarda una nueva marca o actualiza una existente.
   * @param data Objeto con los datos del formulario
   */
  onGuardarMarca(data: any): void {
    if (this.modoEdicion) {
      console.log('Actualizar marca:', data)
      // Implementar actualización si existe el endpoint
    } else {
      this.marcaService.crearMarca(data).subscribe(() => {
        this.cargarMarcas()
        this.formularioVisible = false
      })
    }
  }

  /**
   * Cierra el formulario dinámico y reinicia los datos relacionados.
   */
  onCerrarFormulario(): void {
    this.formularioVisible = false
    this.marcaSeleccionada = null
    this.bloquesFormulario = []
  }

  /**
   * Genera los bloques del formulario dinámico.
   * @param titulo Título del bloque
   * @returns Bloques con campos del formulario
   */
  generarBloquesFormulario(titulo: string): any[] {
    return [
      {
        titulo,
        campos: [
          { key: 'nombre', label: 'Nombre', tipo: 'text', required: true },
          { key: 'descripcion', label: 'Descripción', tipo: 'text', required: false },
        ],
      },
    ]
  }

  /**
   * Maneja el cambio de página.
   * @param pagina Nueva página seleccionada
   */
  onCambioPagina(pagina: number): void {
    this.paginaActual = pagina
  }

  /**
   * Cambia la cantidad de ítems por página.
   * @param cantidad Número de elementos por página
   */
  onCambioItemsPorPagina(cantidad: number): void {
    this.itemsPorPagina = cantidad
    this.paginaActual = 1
  }

  /**
   * Capitaliza el texto separando camelCase con espacios.
   * @param texto Texto a formatear
   * @returns Texto capitalizado
   */
  private capitalizar(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1).replace(/([A-Z])/g, ' $1')
  }
}

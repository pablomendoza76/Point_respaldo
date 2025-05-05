/**
 * Componente que gestiona la vista de grupos de productos con tarifas.
 * Permite listar, buscar, crear, editar y eliminar grupos con un formulario dinámico y un modal de confirmación.
 * Integra el adaptador `adaptarTarifas` para manejar la transformación de datos.
 */

import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { debounceTime, takeUntil } from 'rxjs/operators'
import { TarifasService } from '@modules/administracion/services/productos_services/tarifas.service'
import { MenuRoutesService } from '@modules/administracion/services/servicios_compartidos/menu-routes.service'
import { BarraBusquedaComponent } from '@reusables/barra-busqueda/barra-busqueda.component'
import { BarraUbicacionComponent } from '@reusables/barra-ubicacion/barra-ubicacion.component'
import { DeleteModalComponent } from '@reusables/delete-modal/delete-modal.component'
import { FormularioDinamicoLoaderComponent } from '@reusables/formulario-dinamico-loader/formulario-dinamico-loader.component'
import { adaptarTarifas } from '../../../mapping/productos/tarifas.mapper'

@Component({
  selector: 'app-tarifas-por-grupo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BarraUbicacionComponent,
    BarraBusquedaComponent,
    FormularioDinamicoLoaderComponent,
    DeleteModalComponent,
  ],
  templateUrl: './tarifas-por-grupo.component.html',
  styleUrls: ['./tarifas-por-grupo.component.scss'],
})
export class TarifasPorGrupoComponent implements OnInit, OnDestroy {
  /** Lista original de grupos obtenida desde el backend */
  gruposOriginales: any[] = []

  /** Lista filtrada de grupos para mostrar */
  grupos: any[] = []

  /** Grupo actualmente seleccionado para edición o creación */
  grupoSeleccionado: any = null

  /** Controla la visibilidad del formulario */
  mostrarFormularioEdicion = false

  /** Indica si se está en modo edición (true) o creación (false) */
  esEdicion = true

  /** Registro seleccionado para eliminación */
  registroAEliminar: any = null

  /** Controla la visibilidad del modal de eliminación */
  mostrarModalEliminar = false

  /** Bloques que estructuran el formulario dinámico */
  bloquesFormulario: Array<{ titulo: string; campos: any[] }> = []

  /** Valor de búsqueda en la barra de búsqueda */
  searchValue = ''

  /** Indica si no se encontraron resultados en la búsqueda */
  sinResultados = false

  /** Subject para controlar el debounce de búsqueda */
  private searchSubject = new Subject<string>()

  /** Subject para destruir observables al destruir el componente */
  private destroy$ = new Subject<void>()

  /**
   * Constructor que inyecta servicios necesarios.
   */
  constructor(
    private tarifasService: TarifasService,
    private router: Router,
    private menuRoutesService: MenuRoutesService
  ) {}

  /**
   * Ciclo de vida de inicialización. Carga los grupos y configura el buscador.
   */
  ngOnInit(): void {
    this.obtenerGruposDesdeApi()
    this.searchSubject.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe(() => this.filtrarGrupos())
  }

  /**
   * Ciclo de vida de destrucción. Limpia los observables.
   */
  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  /**
   * Obtiene los grupos con tarifas desde el backend y los adapta.
   */
  obtenerGruposDesdeApi(): void {
    adaptarTarifas.obtenerGruposAdaptados(this.tarifasService).subscribe((data) => {
      this.gruposOriginales = data || []
      this.filtrarGrupos()
    })
  }

  /**
   * Filtra los grupos según el valor de búsqueda.
   */
  filtrarGrupos(): void {
    const valor = this.searchValue.trim().toLowerCase()
    this.grupos = valor
      ? this.gruposOriginales.filter((grupo) => grupo.nombre?.toLowerCase().includes(valor))
      : [...this.gruposOriginales]
    this.sinResultados = this.grupos.length === 0
    if (this.sinResultados) this.grupoSeleccionado = null
  }

  /**
   * Detecta cambios en el input de búsqueda y activa el debounce.
   */
  onSearchChange(): void {
    this.searchSubject.next(this.searchValue)
  }

  /**
   * Selecciona un grupo del listado.
   * @param grupo Grupo seleccionado
   */
  seleccionarGrupo(grupo: any): void {
    this.grupoSeleccionado = grupo
  }

  /**
   * Inicializa el formulario en modo creación.
   */
  agregarGrupo(): void {
    this.esEdicion = false
    this.grupoSeleccionado = {
      codigo: null,
      nombre: '',
      descripcion: '',
      vista_web: 0,
      vista_sistema: 0,
      meses_garantia: 0,
      orden: 0,
      activo: 1,
      parent: 0,
      prodgp_factor_conv: 1,
      img: '',
    }
    this.bloquesFormulario = this.generarBloquesFormulario(this.grupoSeleccionado)
    this.mostrarFormularioEdicion = true
  }

  /**
   * Inicializa el formulario en modo edición.
   * @param grupo Grupo a editar
   */
  editarGrupo(grupo: any): void {
    this.esEdicion = true
    this.grupoSeleccionado = { ...grupo }
    this.bloquesFormulario = this.generarBloquesFormulario(this.grupoSeleccionado)
    this.mostrarFormularioEdicion = true
  }

  /**
   * Guarda los datos del formulario usando el adaptador.
   */
  guardarGrupo(): void {
    const peticion = this.esEdicion
      ? adaptarTarifas.actualizarGrupo(this.tarifasService, this.grupoSeleccionado)
      : adaptarTarifas.crearGrupo(this.tarifasService, this.grupoSeleccionado)

    peticion.subscribe(() => {
      this.obtenerGruposDesdeApi()
      this.mostrarFormularioEdicion = false
    })
  }

  /**
   * Cancela la edición o creación y oculta el formulario.
   */
  cancelarEdicion(): void {
    this.mostrarFormularioEdicion = false
    this.grupoSeleccionado = null
    this.bloquesFormulario = []
  }

  /**
   * Abre el modal de confirmación de eliminación.
   * @param grupo Grupo a eliminar
   */
  abrirModalEliminar(grupo: any): void {
    event?.stopPropagation()
    this.registroAEliminar = grupo
    this.mostrarModalEliminar = true
  }

  /**
   * Cierra el modal de confirmación sin eliminar.
   */
  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false
    this.registroAEliminar = null
  }

  /**
   * Ejecuta la eliminación del grupo.
   */
  eliminarGrupo(): void {
    if (this.registroAEliminar?.codigo) {
      adaptarTarifas.eliminarGrupo(this.tarifasService, this.registroAEliminar.codigo).subscribe(() => {
        this.obtenerGruposDesdeApi()
        this.cerrarModalEliminar()
      })
    }
  }

  /**
   * Cambia el estado del grupo (activo/inactivo).
   */
  cambiarEstado(): void {
    if (this.grupoSeleccionado) {
      this.grupoSeleccionado.activo = this.grupoSeleccionado.activo === 1 ? 0 : 1
    }
  }

  /**
   * Genera los bloques del formulario dinámico.
   * @param grupo Grupo con datos para inicializar el formulario
   */
  generarBloquesFormulario(grupo: any): Array<{ titulo: string; campos: any[] }> {
    return [
      {
        titulo: 'Información General',
        campos: [
          { key: 'nombre', label: 'Nombre del Grupo', tipo: 'text', required: true },
          { key: 'descripcion', label: 'Descripción', tipo: 'text' },
          { key: 'meses_garantia', label: 'Garantía (meses)', tipo: 'number' },
          { key: 'orden', label: 'Orden', tipo: 'number' },
          {
            key: 'vista_web',
            label: 'Vista Web',
            tipo: 'radio',
            opciones: [
              { valor: 1, etiqueta: 'Sí' },
              { valor: 0, etiqueta: 'No' },
            ],
          },
          {
            key: 'vista_sistema',
            label: 'Vista Sistema',
            tipo: 'radio',
            opciones: [
              { valor: 1, etiqueta: 'Sí' },
              { valor: 0, etiqueta: 'No' },
            ],
          },
          {
            key: 'parent',
            label: 'Parent',
            tipo: 'radio',
            opciones: [
              { valor: 1, etiqueta: 'Sí' },
              { valor: 0, etiqueta: 'No' },
            ],
          },
          {
            key: 'activo',
            label: 'Estado',
            tipo: 'radio',
            opciones: [
              { valor: 1, etiqueta: 'Activo' },
              { valor: 0, etiqueta: 'Inactivo' },
            ],
          },
        ],
      },
    ]
  }

  /**
   * Confirma la eliminación del grupo seleccionado.
   */
  confirmarEliminacion(): void {
    this.eliminarGrupo()
  }

  /**
   * Cancela el proceso de eliminación y cierra el modal.
   */
  cancelarEliminacion(): void {
    this.mostrarModalEliminar = false
    this.registroAEliminar = null
  }

  actualizarEstadoGrupo(nuevoValor: boolean): void {
    if (this.grupoSeleccionado) {
      this.grupoSeleccionado.activo = nuevoValor
    }
  }
  
}

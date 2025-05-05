/**
 * Componente que gestiona la vista de tipos de productos.
 * Permite listar, crear y (opcionalmente) editar tipos de productos usando NgRx y formularios dinámicos.
 * Toda la lógica de transformación de datos está delegada al adaptador `adaptarTipoProducto`.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TipoProductoService } from '@modules/administracion/services/productos_services/tipo-producto.service';
import { Store, select } from '@ngrx/store';
import { BarraBusquedaComponent } from '@reusables/barra-busqueda/barra-busqueda.component';
import { BarraUbicacionComponent } from '@reusables/barra-ubicacion/barra-ubicacion.component';
import { FormularioDinamicoLoaderComponent } from '@reusables/formulario-dinamico-loader/formulario-dinamico-loader.component';
import { TablaDinamicaComponent } from '@reusables/tabla-dinamica/tabla-dinamica.component';
import { setColumnasVisibles, setProductos, setTotalRegistros } from '@stores/tabla_NgRx/tabla.actions';
import { selectProductos } from '@stores/tabla_NgRx/tabla.selectors';
import { AppState } from '@stores/tabla_NgRx/tabla.state';
import { Observable } from 'rxjs';
import { adaptarTipoProducto } from '@modules/administracion/mapping/productos/tipo_producto.mapper';

@Component({
  selector: 'app-tipos-productos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BarraUbicacionComponent,
    BarraBusquedaComponent,
    TablaDinamicaComponent,
    FormularioDinamicoLoaderComponent,
  ],
  templateUrl: './tipos-productos.component.html',
  styleUrls: ['./tipos-productos.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TiposProductosComponent implements OnInit {
  /** Observable con los registros visibles en la tabla */
  registrosVisibles$!: Observable<any[]>;

  /** Observable con las columnas visibles seleccionadas */
  columnasVisibles$!: Observable<any[]>;

  /** Objeto tipo producto seleccionado (para editar o crear) */
  tipoProductoSeleccionado: any = null;

  /** Controla la visibilidad del formulario */
  formularioVisible = false;

  /** Controla si se está en modo edición o creación */
  modoEdicion = true;

  /** Bloques del formulario dinámico */
  bloquesFormulario: any[] = [];

  /** Página seleccionada actualmente en la tabla */
  paginaActual = 1;

  /** Número de ítems por página */
  itemsPorPagina = 10;

  /** Total de registros disponibles */
  totalRegistros = 0;

  /** Opciones de paginación disponibles */
  opcionesPaginacion = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 20000, label: 'Todos' },
  ];

  /**
   * Constructor del componente.
   * Inyecta el store global de la aplicación y el servicio de tipos de producto.
   */
  constructor(
    private store: Store<AppState>,
    private tipoProductoService: TipoProductoService
  ) {
    this.registrosVisibles$ = this.store.pipe(select(selectProductos));
  }

  /**
   * Hook de inicialización del componente.
   * Carga los tipos de productos desde el backend.
   */
  ngOnInit(): void {
    this.cargarTiposProductos();
  }

  /**
   * Carga los tipos de productos desde el servicio, utilizando el adaptador,
   * y actualiza el store con los registros, columnas y total.
   */
  cargarTiposProductos(): void {
    adaptarTipoProducto.obtenerTiposAdaptados(this.tipoProductoService).subscribe(({ tipos, columnas, total }) => {
      this.store.dispatch(setProductos({ productos: tipos }));
      this.store.dispatch(setColumnasVisibles({ columnasVisibles: columnas }));
      this.store.dispatch(setTotalRegistros({ total }));
      this.totalRegistros = total;
    });
  }

  /**
   * Abre el formulario en modo creación con datos vacíos por defecto.
   */
  onAgregarNuevoTipo(): void {
    this.modoEdicion = false;
    this.tipoProductoSeleccionado = {
      id: 0,
      nombre: '',
      descripcion: '',
      cod_sustento: '',
      estaActivo: 1,
      fecha: new Date().toISOString().split('T')[0],
      ver: 1,
    };
    this.bloquesFormulario = this.generarBloquesFormulario('Nuevo Tipo de Producto');
    this.formularioVisible = true;
  }

  /**
   * Abre el formulario en modo edición con datos cargados.
   * @param tipo Objeto con los datos del tipo de producto seleccionado.
   */
  onEditarTipo(tipo: any): void {
    this.modoEdicion = true;
    this.tipoProductoSeleccionado = { ...tipo };
    this.bloquesFormulario = this.generarBloquesFormulario('Editar Tipo de Producto');
    this.formularioVisible = true;
  }

  /**
   * Guarda el nuevo tipo de producto o actualiza uno existente.
   * @param data Datos recibidos del formulario dinámico
   */
  onGuardarTipo(data: any): void {
    const datosCompletos = {
      ...data,
      fecha: this.tipoProductoSeleccionado?.fecha || new Date().toISOString().split('T')[0],
    };

    if (this.modoEdicion) {
      // Implementar lógica de edición si el endpoint está disponible
      console.log('Editar tipo producto (pendiente implementación):', datosCompletos);
    } else {
      adaptarTipoProducto.crearTipoProducto(this.tipoProductoService, datosCompletos).subscribe(() => {
        this.cargarTiposProductos();
        this.formularioVisible = false;
      });
    }
  }

  /**
   * Cierra el formulario dinámico y limpia los datos temporales.
   */
  onCerrarFormulario(): void {
    this.formularioVisible = false;
    this.tipoProductoSeleccionado = null;
    this.bloquesFormulario = [];
  }

  /**
   * Genera los bloques del formulario dinámico a renderizar.
   * @param titulo Título del bloque (crear o editar)
   * @returns Arreglo de bloques con campos del formulario
   */
  generarBloquesFormulario(titulo: string): any[] {
    return [
      {
        titulo,
        campos: [
          { key: 'nombre', label: 'Nombre', tipo: 'text', required: true },
          { key: 'descripcion', label: 'Descripción', tipo: 'text', required: false },
          { key: 'cod_sustento', label: 'Código Sustento', tipo: 'text', required: false },
          {
            key: 'estaActivo',
            label: 'Estado',
            tipo: 'radio',
            opciones: [
              { valor: 1, etiqueta: 'Activo' },
              { valor: 0, etiqueta: 'Inactivo' },
            ],
          },
          {
            key: 'ver',
            label: 'Ver',
            tipo: 'radio',
            opciones: [
              { valor: 1, etiqueta: 'Sí' },
              { valor: 0, etiqueta: 'No' },
            ],
          },
        ],
      },
    ];
  }

  /**
   * Maneja el cambio de página en la tabla.
   * @param pagina Nueva página seleccionada.
   */
  onCambioPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  /**
   * Cambia la cantidad de ítems por página y reinicia la paginación.
   * @param cantidad Nueva cantidad seleccionada.
   */
  onCambioItemsPorPagina(cantidad: number): void {
    this.itemsPorPagina = cantidad;
    this.paginaActual = 1;
  }

  /**
   * Convierte un texto camelCase a formato capitalizado con espacios.
   * @param texto Texto de entrada
   * @returns Texto formateado
   */
  private capitalizar(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1).replace(/([A-Z])/g, ' $1');
  }
}

/**
 * Componente que gestiona la vista de tipos de productos, permitiendo crear, editar y listar tipos
 * de productos con paginación, integración NgRx y formulario dinámico reutilizable.
 */
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../state/tabla_NgRx/tabla.state';
import { setProductos, setColumnasVisibles, setTotalRegistros } from '../../../state/tabla_NgRx/tabla.actions';
import { selectProductos } from '../../../state/tabla_NgRx/tabla.selectors';
import { TipoProductoService } from '../../../services/productos_services/tipo-producto.service';
import { BarraUbicacionComponent } from '../../../componentes_reutilizables/barra-ubicacion/barra-ubicacion.component';
import { BarraBusquedaComponent } from '../../../componentes_reutilizables/barra-busqueda/barra-busqueda.component';
import { TablaDinamicaComponent } from '../../../componentes_reutilizables/tabla-dinamica/tabla-dinamica.component';
import { FormularioDinamicoLoaderComponent } from '../../../componentes_reutilizables/formulario-dinamico-loader/formulario-dinamico-loader.component';

@Component({
  selector: 'app-tipos-productos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BarraUbicacionComponent,
    BarraBusquedaComponent,
    TablaDinamicaComponent,
    FormularioDinamicoLoaderComponent
  ],
  templateUrl: './tipos-productos.component.html',
  styleUrls: ['./tipos-productos.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TiposProductosComponent implements OnInit {
  /** Observable con los tipos de producto visibles en la tabla */
  registrosVisibles$!: Observable<any[]>;

  /** Observable con las columnas visibles de la tabla */
  columnasVisibles$!: Observable<any[]>;

  /** Tipo de producto seleccionado para editar o crear */
  tipoProductoSeleccionado: any = null;

  /** Controla la visibilidad del formulario */
  formularioVisible = false;

  /** Controla si se está en modo edición o creación */
  modoEdicion = true;

  /** Bloques del formulario dinámico */
  bloquesFormulario: any[] = [];

  /** Página actual en la paginación */
  paginaActual = 1;

  /** Cantidad de ítems por página */
  itemsPorPagina = 10;

  /** Total de registros disponibles */
  totalRegistros = 0;

  /** Opciones de cantidad de ítems por página */
  opcionesPaginacion = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 20000, label: 'Todos' }
  ];

  /**
   * Constructor con servicios de store y tipos de producto.
   * @param store Store global de la aplicación
   * @param tipoProductoService Servicio para interactuar con tipos de producto
   */
  constructor(
    private store: Store<AppState>,
    private tipoProductoService: TipoProductoService
  ) {
    this.registrosVisibles$ = this.store.pipe(select(selectProductos));
  }

  /** Inicializa el componente cargando los datos */
  ngOnInit(): void {
    this.cargarTiposProductos();
  }

  /**
   * Carga los tipos de productos desde el backend y actualiza el store.
   */
  cargarTiposProductos(): void {
    this.tipoProductoService.getTiposProductos().subscribe(tipos => {
      this.store.dispatch(setProductos({ productos: tipos }));
      this.totalRegistros = tipos.length;

      const columnasDeseadas = ['nombre', 'descripcion', 'cod_sustento', 'estaActivo'];
      const columnas = columnasDeseadas.map(key => ({
        key,
        name: this.capitalizar(key),
        selected: true
      }));

      this.store.dispatch(setColumnasVisibles({ columnasVisibles: columnas }));
      this.store.dispatch(setTotalRegistros({ total: tipos.length }));
    });
  }

  /**
   * Abre el formulario para crear un nuevo tipo de producto.
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
      ver: 1
    };
    this.bloquesFormulario = this.generarBloquesFormulario('Nuevo Tipo de Producto');
    this.formularioVisible = true;
  }

  /**
   * Abre el formulario en modo edición con un tipo de producto existente.
   * @param tipo Objeto del tipo de producto a editar
   */
  onEditarTipo(tipo: any): void {
    this.modoEdicion = true;
    this.tipoProductoSeleccionado = {
      id: tipo.id ?? 0,
      nombre: tipo.nombre ?? '',
      descripcion: tipo.descripcion ?? '',
      cod_sustento: tipo.cod_sustento ?? '',
      estaActivo: tipo.estaActivo ?? 1,
      fecha: tipo.fecha ?? new Date().toISOString().split('T')[0],
      ver: tipo.ver ?? 1
    };
    this.bloquesFormulario = this.generarBloquesFormulario('Editar Tipo de Producto');
    this.formularioVisible = true;
  }

  /**
   * Guarda el tipo de producto creado o actualizado.
   * @param data Datos del formulario dinámico (sin la fecha)
   */
  onGuardarTipo(data: any): void {
    const datosCompletos = {
      ...data,
      fecha: this.tipoProductoSeleccionado?.fecha || new Date().toISOString().split('T')[0]
    };

    if (this.modoEdicion) {
      console.log('Actualizar tipo de producto:', datosCompletos);
      // Implementar lógica de actualización si aplica
    } else {
      this.tipoProductoService.crearTipoProducto(datosCompletos).subscribe(() => {
        this.cargarTiposProductos();
        this.formularioVisible = false;
      });
    }
  }

  /** Cierra el formulario dinámico y resetea el estado */
  onCerrarFormulario(): void {
    this.formularioVisible = false;
    this.tipoProductoSeleccionado = null;
    this.bloquesFormulario = [];
  }

  /**
   * Genera los bloques del formulario dinámico a mostrar
   * @param titulo Título del bloque de formulario
   * @returns Array con campos estructurados por bloques
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
            key: 'estaActivo', label: 'Estado', tipo: 'radio', opciones: [
              { valor: 1, etiqueta: 'Activo' },
              { valor: 0, etiqueta: 'Inactivo' }
            ]
          },
          {
            key: 'ver', label: 'Ver', tipo: 'radio', opciones: [
              { valor: 1, etiqueta: 'Sí' },
              { valor: 0, etiqueta: 'No' }
            ]
          }
        ]
      }
    ];
  }

  /**
   * Actualiza la página seleccionada
   * @param pagina Nueva página seleccionada
   */
  onCambioPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  /**
   * Cambia la cantidad de ítems por página
   * @param cantidad Nueva cantidad seleccionada
   */
  onCambioItemsPorPagina(cantidad: number): void {
    this.itemsPorPagina = cantidad;
    this.paginaActual = 1;
  }

  /**
   * Capitaliza una cadena, separando mayúsculas y agregando espacios
   * @param texto Texto a capitalizar
   * @returns Texto capitalizado
   */
  private capitalizar(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1).replace(/([A-Z])/g, ' $1');
  }
}
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AppState } from '../../../state/tabla_NgRx/tabla.state';
import {
  setProductos,
  setColumnasVisibles,
  setFiltrosDinamicos
} from '../../../state/tabla_NgRx/tabla.actions';
import {
  selectProductosVisibles,
  selectTotalRegistros
} from '../../../state/tabla_NgRx/tabla.selectors';

import { BarraUbicacionComponent } from '../../../componentes_reutilizables/barra-ubicacion/barra-ubicacion.component';
import { BarraBusquedaComponent } from '../../../componentes_reutilizables/barra-busqueda/barra-busqueda.component';
import { TablaDinamicaComponent } from '../../../componentes_reutilizables/tabla-dinamica/tabla-dinamica.component';
import { AdministracionServicios } from '../../../services/productos_services/administracion.service';
import { FormularioDinamicoComponent } from '../../../componentes_reutilizables/formulario-dinamico/formulario-dinamico.component';

/**
 * Componente principal para la vista general de productos.
 * Incluye barra de búsqueda, tabla dinámica y formulario dinámico.
 */
@Component({
  selector: 'app-vista-general',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BarraUbicacionComponent,
    BarraBusquedaComponent,
    TablaDinamicaComponent,
    FormularioDinamicoComponent
  ],
  templateUrl: './vista-general.component.html',
  styleUrls: ['./vista-general.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VistaGeneralComponent implements OnInit {
  /** Productos visibles filtrados desde el store */
  productosVisibles$: Observable<any[]>;

  /** Columnas disponibles para la tabla */
  columnasDisponibles: any[] = [];

  /** Columnas seleccionadas por el usuario */
  columnasSeleccionadas: any[] = [];

  /** Configuración de filtros para la búsqueda */
  filtrosConfiguracion: any[] = [];

  /** Estado de visibilidad del formulario */
  formularioVisible = false;

  /** Producto actualmente seleccionado para editar */
  productoSeleccionado: any = null;

  /** Bloques de campos para el formulario dinámico */
  bloquesFormulario: Array<{ titulo: string; campos: any[] }> = [];

  /** Opciones para el campo de búsqueda */
  opcionesBusqueda = [
    { value: 'codigo', label: 'Cod. Común' },
    { value: 'nombreUnico', label: 'Nombre' },
    { value: 'codbarras1', label: 'Cod. de Barras 1' },
    { value: 'codbarras2', label: 'Cod. de Barras 2' },
    { value: 'codbarras3', label: 'Cod. de Barras 3' }
  ];

  constructor(
    private store: Store<AppState>,
    private adminService: AdministracionServicios
  ) {
    this.productosVisibles$ = this.store.pipe(
      select(selectProductosVisibles),
      tap(data => console.log('Productos visibles:', data))
    );
  }

  /**
   * Inicializa los datos al cargar el componente.
   */
  ngOnInit(): void {
    this.adminService.obtenerProductosYColumnas().subscribe(({ productos, columnas, marcas, grupos }) => {
      this.store.dispatch(setProductos({ productos }));

      this.columnasDisponibles = columnas;
      this.columnasSeleccionadas = columnas.filter(col => col.selected);
      this.store.dispatch(setColumnasVisibles({ columnasVisibles: this.columnasSeleccionadas }));

      this.filtrosConfiguracion = [
        { nombre: 'Grupo', key: 'productogrupoCodigo', opciones: grupos },
        { nombre: 'Marca', key: 'marcaId', opciones: marcas }
      ];
    });
  }

  /**
   * Extrae valores únicos de una propiedad de una lista de productos.
   * @param productos Lista de productos
   * @param key Clave del campo
   * @returns Lista de valores únicos como strings
   */
  extraerValoresUnicos(productos: any[], key: string): string[] {
    return Array.from(
      new Set(productos.map(p => p[key]).filter(v => v !== undefined && v !== null))
    ).map(String);
  }

  /**
   * Evento que se ejecuta al aplicar filtros desde la barra de búsqueda.
   * @param filtros Objeto con los filtros aplicados
   */
  onFiltrosAplicados(filtros: { [key: string]: string }): void {
    this.store.dispatch(setFiltrosDinamicos({ filtrosDinamicos: filtros }));
  }

  /**
   * Evento que se ejecuta al actualizar las columnas visibles.
   * @param columnas Columnas modificadas
   */
  onColumnasActualizadas(columnas: { name: string; key: string; selected: boolean }[]): void {
    this.columnasDisponibles.forEach(col => {
      const actualizada = columnas.find(c => c.key === col.key);
      if (actualizada) {
        col.selected = actualizada.selected;
      }
    });

    this.columnasSeleccionadas = this.columnasDisponibles.filter(col => col.selected);
    this.store.dispatch(setColumnasVisibles({ columnasVisibles: this.columnasSeleccionadas }));
  }

  /**
   * Evento que se ejecuta al hacer clic en editar un producto.
   * @param producto Producto seleccionado
   */
  onEditarProducto(producto: any): void {
    this.productoSeleccionado = { ...producto };
    this.bloquesFormulario = this.generarTodosLosCamposComoBloque(producto);
    console.log('Bloques enviados al formulario:', this.bloquesFormulario);
    this.formularioVisible = true;
  }

  /**
   * Genera bloques organizados de campos según categorías predefinidas.
   * También agrega un bloque "Otros" con campos no clasificados.
   * @param producto Objeto del producto
   * @returns Bloques estructurados con campos asignados
   */
  generarTodosLosCamposComoBloque(producto: any): Array<{ titulo: string; campos: any[] }> {
    const definicionBloques: Record<string, string[]> = {
      'Información Básica': [
        'nombreUnico', 'descripcion', 'productotipoId', 'productogrupoCodigo',
        'idSubgrupo', 'marcaId', 'codbarras1', 'codigo'
      ],
      'Información Adicional': [
        'codbarras2', 'codbarras3', 'codbarras4', 'codbarras5',
        'existenciaMinima', 'existenciaMaxima', 'proteinas', 'calorias',
        'unidadMedida', 'valorMedida', 'origen', 'prodFechaCaducidad',
        'tiempo', 'descuentoActivo', 'especificaciones'
      ],
      'Impuestos y Precios': [
        'pvpServicio', 'pvppromo', 'precio', 'pvpa', 'pvpb', 'pvpc', 'pvpd', 'pvpe',
        'regimenProd', 'iceporcent', 'ivaporcent'
      ],
      'Cuentas': [
        'tipoCuentaCosto', 'tipoCuenta', 'tipoCuentaVentas'
      ]
    };
  
    const bloques: Array<{ titulo: string; campos: any[] }> = [];
  
    for (const [titulo, keys] of Object.entries(definicionBloques)) {
      const campos = keys.map(key => ({
        key,
        label: this.capitalizar(key),
        tipo: this.inferirTipoCampo(producto[key]),
        required: false
      }));
      bloques.push({ titulo, campos });
    }
  
    return bloques;
  }
  
  /**
   * Convierte una clave en texto legible capitalizando palabras.
   * @param texto Texto original en camelCase o snake_case
   * @returns Texto capitalizado
   */
  private capitalizar(texto: string): string {
    return texto
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Infiero el tipo de input para el campo basado en su valor actual.
   * @param valor Valor actual del campo
   * @returns Tipo de input ('text', 'number', 'radio', 'date')
   */
  private inferirTipoCampo(valor: any): string {
    if (typeof valor === 'number') return 'number';
    if (typeof valor === 'boolean') return 'radio';
    if (this.esFecha(valor)) return 'date';
    return 'text';
  }

  /**
   * Verifica si un valor string representa una fecha válida.
   * @param valor Valor a verificar
   * @returns True si es fecha válida, false si no
   */
  private esFecha(valor: any): boolean {
    if (!valor || typeof valor !== 'string') return false;
    return !isNaN(Date.parse(valor));
  }

  /**
   * Evento al guardar el producto desde el formulario.
   * @param productoActualizado Objeto actualizado desde el formulario
   */
  onGuardarProducto(productoActualizado: any): void {
    console.log('Producto actualizado:', productoActualizado);
    this.formularioVisible = false;
  }

  /**
   * Evento al eliminar un producto.
   * @param producto Producto seleccionado
   */
  onEliminarProducto(producto: any): void {
    console.log('Eliminar producto:', producto);
  }
}

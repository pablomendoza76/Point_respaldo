import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs/operators';

import { AppState } from '../state/tabla_NgRx/tabla.state';
import {
  setProductos,
  setPaginaActual,
  setItemsPorPagina,
  setColumnasVisibles,
  setFiltrosDinamicos
} from '../state/tabla_NgRx/tabla.actions';

import {
  selectProductosVisibles,
  selectTotalRegistros
} from '../state/tabla_NgRx/tabla.selectors';

import { BarraUbicacionComponent } from '../componentes_reutilizables/barra-ubicacion/barra-ubicacion.component';
import { BarraBusquedaComponent } from '../componentes_reutilizables/barra-busqueda/barra-busqueda.component';
import { TablaDinamicaComponent } from '../componentes_reutilizables/tabla-dinamica/tabla-dinamica.component';

@Component({
  selector: 'app-pruebra',
  standalone: true,
  imports: [
    CommonModule,
    BarraUbicacionComponent,
    BarraBusquedaComponent,
    TablaDinamicaComponent
  ],
  templateUrl: './pruebra.component.html',
  styleUrls: ['./pruebra.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PruebraComponent implements OnInit {
  /**
   * Observable que contiene los productos visibles (filtrados y con columnas visibles).
   */
  productosVisibles$: Observable<any[]> = of([]);

  /**
   * Observable que contiene el total de registros visibles.
   */
  totalRegistros$: Observable<number> = of(0);

  /**
   * Columnas disponibles con configuración de visibilidad.
   */
  columnasDisponibles = [
    { name: 'Código', key: 'codigo', selected: true },
    { name: 'Nombre', key: 'nombre', selected: true },
    { name: 'Precio', key: 'precio', selected: true },
    { name: 'Stock', key: 'stock', selected: true },
    { name: 'Categoría', key: 'categoria', selected: true },
    { name: 'Marca', key: 'marca', selected: true }
  ];

  /**
   * Opciones disponibles para búsqueda específica por campo.
   */
  opcionesBusqueda = [
    { value: 'codigo', label: 'Código' },
    { value: 'nombre', label: 'Nombre' },
    { value: 'precio', label: 'Precio' }
  ];

  /**
   * Filtros dinámicos disponibles.
   */
  filtrosConfiguracion = [
    {
      nombre: 'Categoría',
      opciones: ['Electrónica', 'Hogar', 'Juguetes']
    },
    {
      nombre: 'Marca',
      opciones: ['Sony', 'Samsung', 'LG']
    }
  ];

  constructor(private store: Store<AppState>) {}

  /**
   * Inicialización del componente.
   * Carga los datos de productos y columnas visibles al inicio.
   */
  ngOnInit(): void {
    this.cargarDatos();

    this.productosVisibles$ = this.store.pipe(
      select(selectProductosVisibles),
      tap((data) => console.log('Productos visibles:', data))
    );

    this.totalRegistros$ = this.store.pipe(
      select(selectTotalRegistros)
    );
  }

  /**
   * Carga productos de prueba quemados y los envía al store junto con las columnas visibles.
   */
  cargarDatos(): void {
    const categorias = ['Electrónica', 'Hogar', 'Juguetes'];
    const marcas = ['Sony', 'Samsung', 'LG'];

    const mockProductos = Array.from({ length: 200 }, (_, i) => ({
      id: i + 1,
      codigo: `COD-${i + 1}`,
      nombre: `Producto ${i + 1}`,
      precio: Math.floor(Math.random() * 1000),
      stock: Math.floor(Math.random() * 100),
      stockMin: Math.floor(Math.random() * 50),
      stockMax: Math.floor(Math.random() * 150),
      categoria: categorias[i % categorias.length],
      marca: marcas[i % marcas.length]
    }));

    // ✅ Despacho de productos
    this.store.dispatch(setProductos({ productos: mockProductos }));

    // ✅ Despacho de columnas visibles iniciales (clonadas para evitar errores de mutabilidad)
    const columnasVisibles = this.columnasDisponibles
      .filter(col => col.selected)
      .map(col => ({ ...col }));

    this.store.dispatch(setColumnasVisibles({ columnasVisibles }));

    console.log('🔥 Columnas visibles al cargar:', columnasVisibles);
  }

  /**
   * Recibe filtros aplicados desde barra-busqueda y los despacha al store.
   */
  onFiltrosAplicados(filtros: { [key: string]: string }): void {
    console.log('✅ Filtros aplicados:', filtros);
    this.store.dispatch(setFiltrosDinamicos({ filtrosDinamicos: filtros }));
  }

  /**
   * Recibe columnas actualizadas y despacha su estado completo al store.
   */
  onColumnasActualizadas(columnas: { name: string; key: string; selected: boolean }[]): void {
    this.columnasDisponibles = columnas.map(col => ({ ...col }));
    console.log('✅ Columnas visibles actualizadas:', columnas);

    const visibles = this.columnasDisponibles.filter(col => col.selected);
    this.store.dispatch(setColumnasVisibles({ columnasVisibles: visibles }));
  }

  /**
   * Acción de edición de producto desde la tabla.
   */
  onEditarProducto(producto: any): void {
    console.log('Editar producto:', producto);
  }

  /**
   * Acción de eliminación de producto desde la tabla.
   */
  onEliminarProducto(producto: any): void {
    console.log('Eliminar producto:', producto);
  }

  /**
   * Mostrar/Ocultar menú desplegable.
   */
  toggleDropdown(event: Event): void {
    event.stopPropagation();
    const button = event.currentTarget as HTMLElement;
    button.classList.toggle('active');
  }

  /**
   * Mostrar/Ocultar menú de filtros.
   */
  toggleFilter(event: Event): void {
    event.stopPropagation();
    const button = event.currentTarget as HTMLElement;
    const filterContent = button.nextElementSibling as HTMLElement;
    if (filterContent) {
      filterContent.classList.toggle('hidden');
    }
  }
}

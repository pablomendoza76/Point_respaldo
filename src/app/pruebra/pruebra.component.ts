import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs/operators';

import { NavbarComponent } from '../componentes_reutilizables/navbar/navbar.component';
import { DynamicMenuComponent } from '../componentes_reutilizables/dynamic-menu/dynamic-menu.component';
import { BarraUbicacionComponent } from '../componentes_reutilizables/barra-ubicacion/barra-ubicacion.component';
import { BarraBusquedaComponent } from '../componentes_reutilizables/barra-busqueda/barra-busqueda.component';
import { TablaDinamicaComponent } from '../componentes_reutilizables/tabla-dinamica/tabla-dinamica.component';

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

import { MENU_CONFIG } from '../menu.config';
import { MenuItem } from '../componentes_reutilizables/dynamic-menu/dynamic-menu.component';

@Component({
  selector: 'app-pruebra',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    DynamicMenuComponent,
    BarraUbicacionComponent,
    BarraBusquedaComponent,
    TablaDinamicaComponent
  ],
  templateUrl: './pruebra.component.html',
  styleUrls: ['./pruebra.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PruebraComponent implements OnInit {
  /** Observable con los productos visibles aplicando filtros, paginación y columnas */
  productosVisibles$: Observable<any[]> = of([]);

  /** Observable con el total de registros filtrados */
  totalRegistros$: Observable<number> = of(0);

  /** Configuración de columnas disponibles para la tabla */
  columnasDisponibles = [
    { name: 'Código', key: 'codigo', selected: true },
    { name: 'Nombre', key: 'nombre', selected: true },
    { name: 'Precio', key: 'precio', selected: true },
    { name: 'Stock', key: 'stock', selected: true },
    { name: 'Categoría', key: 'categoria', selected: false },
    { name: 'Marca', key: 'marca', selected: true }
  ];

  /** Opciones disponibles para el buscador */
  opcionesBusqueda = [
    { value: 'codigo', label: 'Código' },
    { value: 'nombre', label: 'Nombre' },
    { value: 'precio', label: 'Precio' }
  ];

  /** Filtros dinámicos configurables para el buscador */
  filtrosConfiguracion = [
    {
      nombre: 'Categoría',
      key: 'categoria',
      opciones: ['Electrónica', 'Hogar', 'Juguetes']
    },
    {
      nombre: 'Marca',
      key: 'marca',
      opciones: ['Sony', 'Samsung', 'LG']
    }
  ];

  /** Elementos principales del menú */
  menuPadre: MenuItem[] = MENU_CONFIG.principales;

  /** Mapa con todos los hijos por módulo */
  menuHijosMap: { [modulo: string]: MenuItem[] } = MENU_CONFIG.hijos;

  /** Control de colapso del menú padre */
  isMenuCollapsed = false;

  constructor(private store: Store<AppState>) {}

  /** Inicializa la carga de datos y los observables desde el store */
  ngOnInit(): void {
    this.cargarDatos();

    this.productosVisibles$ = this.store.pipe(
      select(selectProductosVisibles),
      tap((data) => console.log('Productos visibles:', data))
    );

    this.totalRegistros$ = this.store.pipe(select(selectTotalRegistros));
  }

  /** Carga datos de prueba y despacha productos y columnas visibles al store */
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

    this.store.dispatch(setProductos({ productos: mockProductos }));

    const columnasVisibles = this.columnasDisponibles
      .filter(col => col.selected)
      .map(col => ({ ...col }));

    this.store.dispatch(setColumnasVisibles({ columnasVisibles }));
    console.log('🔥 Columnas visibles al cargar:', columnasVisibles);
  }

  /**
   * Maneja los filtros aplicados desde la barra de búsqueda
   * @param filtros Objeto con los filtros seleccionados por clave-valor
   */
  onFiltrosAplicados(filtros: { [key: string]: string }): void {
    console.log('✅ Filtros aplicados:', filtros);
    this.store.dispatch(setFiltrosDinamicos({ filtrosDinamicos: filtros }));
  }

  /**
   * Actualiza columnas visibles según selección del usuario
   * @param columnas Array de columnas con su estado actualizado
   */
  onColumnasActualizadas(columnas: { name: string; key: string; selected: boolean }[]): void {
    this.columnasDisponibles = columnas.map(col => ({ ...col }));
    const visibles = this.columnasDisponibles.filter(col => col.selected);
    this.store.dispatch(setColumnasVisibles({ columnasVisibles: visibles }));
  }

  /**
   * Acciones para editar un producto desde la tabla
   * @param producto Objeto del producto a editar
   */
  onEditarProducto(producto: any): void {
    console.log('Editar producto:', producto);
  }

  /**
   * Acciones para eliminar un producto desde la tabla
   * @param producto Objeto del producto a eliminar
   */
  onEliminarProducto(producto: any): void {
    console.log('Eliminar producto:', producto);
  }

  /**
   * Abre o cierra el dropdown manualmente (estilo topbar)
   * @param event Evento de clic del botón
   */
  toggleDropdown(event: Event): void {
    event.stopPropagation();
    const button = event.currentTarget as HTMLElement;
    button.classList.toggle('active');
  }

  /**
   * Abre o cierra el panel de filtros en vista móvil o topbar
   * @param event Evento de clic del botón
   */
  toggleFilter(event: Event): void {
    event.stopPropagation();
    const button = event.currentTarget as HTMLElement;
    const filterContent = button.nextElementSibling as HTMLElement;
    if (filterContent) {
      filterContent.classList.toggle('hidden');
    }
  }

  /**
   * Maneja el clic en un elemento del menú hijo
   * @param item Elemento del submenú clickeado
   */
  onMenuHijoClick(item: MenuItem): void {
    if (item.route) {
      console.log('Ruta seleccionada:', item.route);
    }
  }

  /**
   * Alterna el estado colapsado del menú padre
   */
  toggleMenuCollapse(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  
}

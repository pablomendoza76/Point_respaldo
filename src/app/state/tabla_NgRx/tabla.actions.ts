import { createAction, props } from '@ngrx/store';
import { ColumnaVisible } from './tabla.model';

/**
 * Acción para establecer los productos originales (sin filtros aplicados).
 */
export const setProductos = createAction(
  '[Tabla] Set Productos',
  props<{ productos: any[] }>()
);

/**
 * Acción para establecer los productos visibles (filtrados y paginados).
 */
export const setProductosVisibles = createAction(
  '[Tabla] Set Productos Visibles',
  props<{ productosVisibles: any[] }>()
);

/**
 * Acción para establecer las columnas visibles en la tabla.
 */
export const setColumnasVisibles = createAction(
  '[Tabla] Set Columnas Visibles',
  props<{ columnasVisibles: { name: string; key: string; selected: boolean }[] }>()
);

/**
 * Acción para establecer filtros dinámicos (marca, categoría, etc.).
 */
export const setFiltrosDinamicos = createAction(
  '[Tabla] Set Filtros Dinámicos',
  props<{ filtrosDinamicos: { [key: string]: string } }>()
);

/**
 * Acción para establecer el término de búsqueda global.
 */
export const setSearchTerm = createAction(
  '[Tabla] Set Search Term',
  props<{ searchTerm: string }>()
);

/**
 * Acción para establecer el filtro activo (estado: todos, stock, medio, sin stock).
 */
export const setFiltroActivo = createAction(
  '[Tabla] Set Filtro Activo',
  props<{ filtroActivo: string }>()
);

/**
 * Acción para cambiar la página actual.
 */
export const setPaginaActual = createAction(
  '[Tabla] Set Página Actual',
  props<{ paginaActual: number }>()
);

/**
 * Acción para establecer la cantidad de ítems por página.
 */
export const setItemsPorPagina = createAction(
  '[Tabla] Set Items Por Página',
  props<{ itemsPorPagina: number }>()
);

/**
 * Acción para actualizar el total de registros visibles.
 */
export const setTotalRegistros = createAction(
  '[Tabla] Set Total Registros',
  props<{ totalRegistros: number }>()
);

/**
 * Acción para cargar los productos iniciales (mock o desde API).
 */
export const cargarProductos = createAction('[Tabla] Cargar Productos');

/**
 * Acción para eliminar un producto )sincronizar con el store)
 */
export const eliminarProducto = createAction(
  '[Tabla] Eliminar producto',
  props<{ producto: any }>()
);


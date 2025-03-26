import { createAction, props } from '@ngrx/store';

/**
 * ✅ Establece el término de búsqueda.
 */
export const setSearchTerm = createAction(
  '[Filter] Set Search Term',
  props<{ searchTerm: string }>()
);

/**
 * ✅ Establece el filtro activo (estado).
 */
export const setFiltroActivo = createAction(
  '[Filter] Set Filtro Activo',
  props<{ filtroActivo: string }>()
);

/**
 * ✅ Establece los filtros dinámicos.
 */
export const setFiltrosDinamicos = createAction(
  '[Filter] Set Filtros Dinamicos',
  props<{ filtrosDinamicos: { [key: string]: string } }>()
);

/**
 * ✅ Limpia los filtros dinámicos.
 */
export const limpiarFiltrosDinamicos = createAction(
  '[Filter] Clear Filtros Dinamicos'
);

/**
 * ✅ Restablece todos los filtros.
 */
export const resetFilters = createAction('[Filter] Reset Filters');

/**
 * ✅ Actualiza las columnas visibles.
 */
export const setColumnasVisibles = createAction(
  '[Filtros] Set Columnas Visibles',
  props<{ columnasVisibles: { name: string; key: string }[] }>()
);

/**
 * ✅ Establece los productos completos.
 */
export const setProductos = createAction(
  '[Filtros] Set Productos',
  props<{ productos: any[] }>()
);

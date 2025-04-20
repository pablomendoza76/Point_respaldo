import { createAction, props } from '@ngrx/store';

/**
 * 🎯 Acción para establecer el término de búsqueda
 * @param {string} searchTerm - Término de búsqueda a establecer
 */
export const setSearchTerm = createAction(
  '[Filter] Set Search Term',
  props<{ searchTerm: string }>()
);

/**
 * 🎯 Acción para establecer el filtro activo (estado)
 * @param {string} filtroActivo - Valor del filtro a aplicar
 */
export const setFiltroActivo = createAction(
  '[Filter] Set Filtro Activo',
  props<{ filtroActivo: string }>()
);

/**
 * 🎯 Acción para establecer múltiples filtros dinámicos
 * @param {Object} filtrosDinamicos - Objeto con pares clave-valor de filtros
 */
export const setFiltrosDinamicos = createAction(
  '[Filter] Set Filtros Dinamicos',
  props<{ filtrosDinamicos: { [key: string]: string } }>()
);

/**
 * 🧹 Acción para limpiar todos los filtros dinámicos
 * Restablece los filtros a su estado inicial
 */
export const limpiarFiltrosDinamicos = createAction(
  '[Filter] Clear Filtros Dinamicos'
);

/**
 * 🔄 Acción para resetear completamente todos los filtros
 * Incluye término de búsqueda, filtro activo y filtros dinámicos
 */
export const resetFilters = createAction('[Filter] Reset Filters');
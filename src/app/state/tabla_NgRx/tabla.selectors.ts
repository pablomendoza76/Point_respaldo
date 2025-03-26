import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TablaState } from './tabla.model';

/**
 * Selector raíz para acceder al estado de la tabla.
 */
export const selectTablaState = createFeatureSelector<TablaState>('tabla');

/**
 * Selector para obtener todos los productos originales (sin filtros).
 */
export const selectProductos = createSelector(
  selectTablaState,
  (state) => state.productos
);

/**
 * Selector para obtener los productos visibles (filtrados y con columnas aplicadas).
 */
export const selectProductosVisibles = createSelector(
  selectTablaState,
  (state) => state.productosVisibles
);

/**
 * Selector para obtener las columnas visibles.
 */
export const selectColumnasVisibles = createSelector(
  selectTablaState,
  (state) => state.columnasVisibles
);

/**
 * Selector para obtener el término de búsqueda actual.
 */
export const selectSearchTerm = createSelector(
  selectTablaState,
  (state) => state.searchTerm
);

/**
 * Selector para obtener los filtros dinámicos activos.
 */
export const selectFiltrosDinamicos = createSelector(
  selectTablaState,
  (state) => state.filtrosDinamicos
);

/**
 * Selector para obtener la página actual.
 */
export const selectPaginaActual = createSelector(
  selectTablaState,
  (state) => state.paginaActual
);

/**
 * Selector para obtener el total de registros visibles.
 */
export const selectTotalRegistros = createSelector(
  selectTablaState,
  (state) => state.totalRegistros
);

/**
 * Selector para obtener el número de ítems por página.
 */
export const selectItemsPorPagina = createSelector(
  selectTablaState,
  (state) => state.itemsPorPagina
);

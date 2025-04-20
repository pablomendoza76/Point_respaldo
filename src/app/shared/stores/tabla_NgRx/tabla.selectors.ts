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
 * Selector para obtener los filtros dinámicos activos.
 */
export const selectFiltrosDinamicos = createSelector(
  selectTablaState,
  (state) => state.filtrosDinamicos
);

/**
 * Selector intermedio que aplica únicamente los filtros dinámicos.
 */
export const selectProductosFiltrados = createSelector(
  selectProductos,
  selectFiltrosDinamicos,
  (productos, filtros) => {
    if (!filtros || Object.keys(filtros).length === 0) return productos;

    return productos.filter(producto =>
      Object.entries(filtros).every(([key, valorFiltro]) => {
        const valorProducto = producto[key];
        if (valorProducto === null || valorProducto === undefined) return false;

        if (typeof valorProducto === 'number') {
          return valorProducto === Number(valorFiltro);
        }

        return valorProducto.toString().toLowerCase().includes(valorFiltro.toString().toLowerCase());
      })
    );
  }
);

/**
 * Selector para obtener los productos visibles (con paginación aplicada).
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

/**
 * Selector para tener los productos originales
 */
export const selectProductosOriginales = createSelector(
  selectTablaState,
  (state) => state.productosOriginales
);

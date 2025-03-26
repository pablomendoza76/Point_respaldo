import { createReducer, on } from '@ngrx/store';
import {
  setPaginaActual,
  setItemsPorPagina,
  setTotalRegistros,
  setProductos,
  setFiltrosDinamicos,
  setColumnasVisibles,
  setSearchTerm,
  setFiltroActivo
} from './tabla.actions';
import { TablaState } from './tabla.model';

/**
 * Estado inicial de la tabla.
 */
export const initialState: TablaState = {
  productos: [],
  productosVisibles: [],
  columnasVisibles: [],
  paginaActual: 1,
  itemsPorPagina: 10,
  totalRegistros: 0,
  searchTerm: '',
  filtrosDinamicos: {}
};

/**
 * Aplica filtros de búsqueda, dinámicos y filtros especiales (stock, medio, sin stock).
 * @param state Estado actual de la tabla
 * @returns Lista de productos filtrados
 */
function filtrarProductos(state: TablaState): any[] {
  let productosFiltrados = [...state.productos];

  // Filtro por término de búsqueda
  if (state.searchTerm) {
    productosFiltrados = productosFiltrados.filter((producto) =>
      Object.values(producto).some((value) =>
        value?.toString().toLowerCase().includes(state.searchTerm.toLowerCase())
      )
    );
  }

  // Filtros dinámicos incluyendo filtro por estado
  Object.keys(state.filtrosDinamicos).forEach((key) => {
    const valor = state.filtrosDinamicos[key];
    if (!valor || valor === 'todos') return;

    if (key === 'estado') {
      if (valor === 'stock') {
        productosFiltrados = productosFiltrados.filter((p) => p.stock > 0);
      } else if (valor === 'medio') {
        productosFiltrados = productosFiltrados.filter((p) => {
          const promedio = (p.stockMin + p.stockMax) / 2;
          return p.stock <= promedio;
        });
      } else if (valor === 'sin_stock') {
        productosFiltrados = productosFiltrados.filter((p) => p.stock === 0);
      }
    } else {
      const claveReal = key.toLowerCase();
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto[claveReal]?.toString() === valor
      );
    }
  });

  return productosFiltrados;
}

/**
 * Filtra las columnas visibles para cada producto.
 */
function mapearColumnasVisibles(productos: any[], columnas: { name: string; key: string }[]): any[] {
  if (!columnas || columnas.length === 0) {
    return productos;
  }

  return productos.map((producto) => {
    const result: any = {};
    columnas.forEach((col) => {
      if (col.key in producto) {
        result[col.key] = producto[col.key];
      }
    });
    return result;
  });
}

/**
 * Aplica la paginación sobre la lista de productos.
 */
function aplicarPaginacion(productos: any[], pagina: number, itemsPorPagina: number): any[] {
  if (itemsPorPagina === 20000) return productos;
  const start = (pagina - 1) * itemsPorPagina;
  return productos.slice(start, start + itemsPorPagina);
}

/**
 * Recalcula los productos visibles combinando filtros, columnas y paginación.
 */
function recalcularProductosVisibles(state: TablaState): any[] {
  const filtrados = filtrarProductos(state);
  const conColumnas = mapearColumnasVisibles(filtrados, state.columnasVisibles);
  return aplicarPaginacion(conColumnas, state.paginaActual, state.itemsPorPagina);
}

/**
 * Reducer principal del estado de la tabla.
 */
export const tablaReducer = createReducer(
  initialState,

  on(setProductos, (state, { productos }) => {
    const nuevoState = { ...state, productos };
    return {
      ...nuevoState,
      productosVisibles: recalcularProductosVisibles(nuevoState),
      totalRegistros: filtrarProductos(nuevoState).length
    };
  }),

  on(setFiltrosDinamicos, (state, { filtrosDinamicos }) => {
    const nuevosFiltros = { ...state.filtrosDinamicos, ...filtrosDinamicos };
    const nuevoState = { ...state, filtrosDinamicos: nuevosFiltros };
    return {
      ...nuevoState,
      productosVisibles: recalcularProductosVisibles(nuevoState),
      totalRegistros: filtrarProductos(nuevoState).length
    };
  }),

  on(setFiltroActivo, (state, { filtroActivo }) => {
    const nuevosFiltros = { ...state.filtrosDinamicos, estado: filtroActivo };
    const nuevoState = { ...state, filtrosDinamicos: nuevosFiltros };
    return {
      ...nuevoState,
      productosVisibles: recalcularProductosVisibles(nuevoState),
      totalRegistros: filtrarProductos(nuevoState).length
    };
  }),

  on(setSearchTerm, (state, { searchTerm }) => {
    const nuevoState = { ...state, searchTerm };
    return {
      ...nuevoState,
      productosVisibles: recalcularProductosVisibles(nuevoState),
      totalRegistros: filtrarProductos(nuevoState).length
    };
  }),

  on(setColumnasVisibles, (state, { columnasVisibles }) => {
    const nuevoState = { ...state, columnasVisibles };
    return {
      ...nuevoState,
      productosVisibles: recalcularProductosVisibles(nuevoState)
    };
  }),

  on(setPaginaActual, (state, { paginaActual }) => {
    const nuevoState = { ...state, paginaActual };
    return {
      ...nuevoState,
      productosVisibles: recalcularProductosVisibles(nuevoState)
    };
  }),

  on(setItemsPorPagina, (state, { itemsPorPagina }) => {
    const nuevoState = { ...state, itemsPorPagina };
    return {
      ...nuevoState,
      productosVisibles: recalcularProductosVisibles(nuevoState)
    };
  }),

  on(setTotalRegistros, (state, { totalRegistros }) => ({
    ...state,
    totalRegistros
  }))
);

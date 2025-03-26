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
 * 🔍 Aplica filtros por búsqueda y filtros dinámicos.
 */
function filtrarProductos(state: TablaState): any[] {
  let productosFiltrados = [...state.productos];

  // 🔍 Filtro por búsqueda
  if (state.searchTerm) {
    productosFiltrados = productosFiltrados.filter((producto) =>
      Object.values(producto).some((value) =>
        value?.toString().toLowerCase().includes(state.searchTerm.toLowerCase())
      )
    );
  }

  // 🚦 Filtros dinámicos
  Object.keys(state.filtrosDinamicos).forEach((key) => {
    const valor = state.filtrosDinamicos[key];
    if (valor && valor !== 'todos') {
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto[key]?.toString() === valor
      );
    }
  });

  // ⚖️ Filtro especial "medio"
  if (state.filtrosDinamicos['estado'] === 'medio') {
    productosFiltrados = productosFiltrados.filter((producto) => {
      const promedio = (producto.stockMin + producto.stockMax) / 2;
      return producto.stock <= promedio;
    });
  }

  return productosFiltrados;
}

/**
 * 🎯 Muestra solo las columnas seleccionadas.
 */
function mapearColumnasVisibles(productos: any[], columnas: { name: string; key: string }[]): any[] {
  if (!columnas || columnas.length === 0) {
    return productos; // Mostrar todo si no hay columnas seleccionadas
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
 * 📄 Aplica paginación.
 */
function aplicarPaginacion(productos: any[], pagina: number, itemsPorPagina: number): any[] {
  if (itemsPorPagina === 20000) return productos; // "Todos"
  const start = (pagina - 1) * itemsPorPagina;
  return productos.slice(start, start + itemsPorPagina);
}

/**
 * 🔄 Recalcula los productos visibles.
 */
function recalcularProductosVisibles(state: TablaState): any[] {
  const filtrados = filtrarProductos(state);
  const conColumnas = mapearColumnasVisibles(filtrados, state.columnasVisibles);
  return aplicarPaginacion(conColumnas, state.paginaActual, state.itemsPorPagina);
}

/**
 * Reducer principal de la tabla.
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

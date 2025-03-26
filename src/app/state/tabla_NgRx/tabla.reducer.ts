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
 * @param state Estado actual de la tabla
 * @returns Lista filtrada de productos
 */
function filtrarProductos(state: TablaState): any[] {
  let productosFiltrados = [...state.productos];

  // 🔍 Filtro por término de búsqueda
  if (state.searchTerm) {
    productosFiltrados = productosFiltrados.filter((producto) =>
      Object.values(producto).some((value) =>
        value?.toString().toLowerCase().includes(state.searchTerm.toLowerCase())
      )
    );
  }

  // 🚦 Filtros dinámicos aplicados (Marca, Categoría, etc.)
  Object.keys(state.filtrosDinamicos).forEach((key) => {
    const valor = state.filtrosDinamicos[key];
    if (valor && valor !== 'todos') {
      const claveReal = key.toLowerCase(); // ⚠️ clave normalizada
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto[claveReal]?.toString() === valor
      );
    }
  });

  // ⚖️ Filtro especial "medio" basado en promedio de stock
  if (state.filtrosDinamicos['estado'] === 'medio') {
    productosFiltrados = productosFiltrados.filter((producto) => {
      const promedio = (producto.stockMin + producto.stockMax) / 2;
      return producto.stock <= promedio;
    });
  }

  return productosFiltrados;
}

/**
 * 🎯 Mapea solo las columnas seleccionadas para cada producto.
 * @param productos Lista de productos filtrados
 * @param columnas Columnas visibles
 * @returns Productos con solo las propiedades visibles
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
 * 📄 Aplica la paginación a los productos.
 */
function aplicarPaginacion(productos: any[], pagina: number, itemsPorPagina: number): any[] {
  if (itemsPorPagina === 20000) return productos; // "Todos"
  const start = (pagina - 1) * itemsPorPagina;
  return productos.slice(start, start + itemsPorPagina);
}

/**
 * 🔄 Recalcula los productos visibles combinando filtros, columnas y paginación.
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

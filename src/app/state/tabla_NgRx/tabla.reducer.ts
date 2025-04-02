import { createReducer, on } from '@ngrx/store';
import {
  setPaginaActual,
  setItemsPorPagina,
  setTotalRegistros,
  setProductos,
  setFiltrosDinamicos,
  setColumnasVisibles,
  setSearchTerm,
  setFiltroActivo,
  eliminarProducto
} from './tabla.actions';
import { TablaState } from './tabla.model';

/** Estado inicial de la tabla */
export const initialState: TablaState = {
  productos: [],
  productosOriginales: [], // ✅ agregado para evitar error TS2741
  productosVisibles: [],
  columnasVisibles: [],
  paginaActual: 1,
  itemsPorPagina: 10,
  totalRegistros: 0,
  searchTerm: '',
  filtrosDinamicos: {}
};

/**
 * Aplica filtros globales y dinámicos sobre la lista de productos.
 */
function filtrarProductos(state: TablaState): any[] {
  let productosFiltrados = [...state.productos];

  if (state.searchTerm) {
    productosFiltrados = productosFiltrados.filter(producto =>
      Object.values(producto).some(value =>
        value?.toString().toLowerCase().includes(state.searchTerm.toLowerCase())
      )
    );
  }

  Object.entries(state.filtrosDinamicos).forEach(([key, valor]) => {
    if (!valor || valor === 'todos') return;

    if (key === 'estado') {
      productosFiltrados = productosFiltrados.filter(p => {
        const stock = parseFloat(p.stockactual || '0');
        const stockMin = parseFloat(p.existenciaMinima || '0');
        const stockMax = parseFloat(p.existenciaMaxima || '0');
        const promedio = (stockMin + stockMax) / 2;

        if (valor === 'stock') return stock > 0;
        if (valor === 'medio') return stock <= promedio;
        if (valor === 'sin_stock') return stock === 0;
        return true;
      });
    } else {
      productosFiltrados = productosFiltrados.filter(producto => {
        const valorProducto = producto[key];
        if (valorProducto === undefined || valorProducto === null) return false;

        if (!isNaN(Number(valorProducto))) {
          return Number(valorProducto) === Number(valor);
        }

        return valorProducto.toString().toLowerCase() === valor.toString().toLowerCase();
      });
    }
  });

  return productosFiltrados;
}

/**
 * Devuelve los productos con solo las columnas visibles mapeadas.
 */
function mapearColumnasVisibles(productos: any[], columnas: { name: string; key: string }[]): any[] {
  if (!columnas || columnas.length === 0) return productos;

  return productos.map(producto => {
    const resultado: any = {};
    columnas.forEach(col => {
      if (col.key in producto) resultado[col.key] = producto[col.key];
    });
    return resultado;
  });
}

/**
 * Aplica paginación a la lista de productos.
 */
function aplicarPaginacion(productos: any[], pagina: number, itemsPorPagina: number): any[] {
  if (itemsPorPagina === 20000) return productos;
  const start = (pagina - 1) * itemsPorPagina;
  return productos.slice(start, start + itemsPorPagina);
}

/**
 * Recalcula los productos visibles aplicando filtros, columnas visibles y paginación.
 */
function recalcularProductosVisibles(state: TablaState): any[] {
  const filtrados = filtrarProductos(state);
  const conColumnas = mapearColumnasVisibles(filtrados, state.columnasVisibles);
  return [...aplicarPaginacion(conColumnas, state.paginaActual, state.itemsPorPagina)];
}

/** Reducer principal de la tabla */
export const tablaReducer = createReducer(
  initialState,

  on(setProductos, (state, { productos }) => {
    const nuevoState = {
      ...state,
      productos,
      productosOriginales: productos
    };
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
  })),

  on(eliminarProducto, (state, { producto }) => {
    const productosActualizados = state.productos.filter(p => p.codigo !== producto.codigo);
    const nuevoState = { ...state, productos: productosActualizados };
    return {
      ...nuevoState,
      productosVisibles: recalcularProductosVisibles(nuevoState),
      totalRegistros: filtrarProductos(nuevoState).length
    };
  })
);

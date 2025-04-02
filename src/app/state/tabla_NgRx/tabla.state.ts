import { FilterState } from '../Filtros_NgRx/filter.model';
import { TablaState } from './tabla.model';

/**
 * Estado global de la aplicación.
 */
export interface AppState {
  filters: FilterState;
  tabla: TablaState;
}

/**
 * Estado inicial global de la aplicación.
 */
export const initialState: AppState = {
  filters: {
    searchTerm: '',
    filtroActivo: 'todos',
    filtrosDinamicos: {}
  },
  tabla: {
    columnasVisibles: [],
    productos: [],
    productosOriginales: [], // ✅ nuevo
    productosVisibles: [],
    paginaActual: 1,
    itemsPorPagina: 10,
    totalRegistros: 0,
    searchTerm: '',
    filtrosDinamicos: {}
  }
  
};

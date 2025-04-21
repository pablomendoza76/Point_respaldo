import { FilterState } from './filter.model';

export const initialState: FilterState = {
  searchTerm: '',
  filtroActivo: 'todos',
  filtrosDinamicos: {},
  // columnasVisibles: [],
  // productos: [],
  // productosVisibles: []
}

export function cloneState<T>(state: T): T {
  try {
    return structuredClone(state);
  } catch (e) {
    return JSON.parse(JSON.stringify(state));
  }
}

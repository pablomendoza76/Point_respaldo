import { createReducer, on } from '@ngrx/store';
import {
  setSearchTerm,
  setFiltroActivo,
  setFiltrosDinamicos,
  limpiarFiltrosDinamicos,
  resetFilters
} from './filter.actions';
import { FilterState } from './filter.model';

export const initialState: FilterState = {
  searchTerm: '',
  filtroActivo: 'todos',
  filtrosDinamicos: {}
};

export const filterReducer = createReducer(
  initialState,

  on(setSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm
  })),

  on(setFiltroActivo, (state, { filtroActivo }) => ({
    ...state,
    filtroActivo
  })),

  on(setFiltrosDinamicos, (state, { filtrosDinamicos }) => ({
    ...state,
    filtrosDinamicos: { ...state.filtrosDinamicos, ...filtrosDinamicos }
  })),

  on(limpiarFiltrosDinamicos, (state) => ({
    ...state,
    filtrosDinamicos: {}
  })),

  on(resetFilters, () => initialState)
);

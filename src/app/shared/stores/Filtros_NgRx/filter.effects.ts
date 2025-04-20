import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  setSearchTerm,
  setFiltroActivo,
  setFiltrosDinamicos
} from './filter.actions';
import {
  setSearchTerm as setSearchTermTabla,
  setFiltroActivo as setFiltroActivoTabla,
  setFiltrosDinamicos as setFiltrosDinamicosTabla
} from '../tabla_NgRx/tabla.actions';
import { map } from 'rxjs/operators';

@Injectable()
export class FilterEffects {
  constructor(private actions$: Actions) {}

  /**
   * 🔄 Reenvía el término de búsqueda desde filtros a la tabla.
   */
  reenviarSearchTerm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setSearchTerm),
      map(({ searchTerm }) => setSearchTermTabla({ searchTerm }))
    )
  );

  /**
   * 🔄 Reenvía el filtro activo ('estado') a la tabla.
   */
  reenviarFiltroActivo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setFiltroActivo),
      map(({ filtroActivo }) => setFiltroActivoTabla({ filtroActivo }))
    )
  );

  /**
   * 🔄 Reenvía todos los filtros dinámicos a la tabla.
   */
  reenviarFiltrosDinamicos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setFiltrosDinamicos),
      map(({ filtrosDinamicos }) => setFiltrosDinamicosTabla({ filtrosDinamicos }))
    )
  );
}

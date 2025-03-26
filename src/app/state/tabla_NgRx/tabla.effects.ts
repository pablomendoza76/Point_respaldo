import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, withLatestFrom } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import {
  setProductos,
  setPaginaActual,
  setItemsPorPagina,
  setProductosVisibles
} from './tabla.actions';
import { AppState } from './tabla.model';
import {
  selectTablaState,
  selectPaginaActual,
  selectItemsPorPagina
} from './tabla.selectors';

@Injectable()
export class TablaEffects {
  actualizarProductosVisibles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setProductos, setPaginaActual, setItemsPorPagina),
      withLatestFrom(
        this.store.pipe(select(selectTablaState)),
        this.store.pipe(select(selectPaginaActual)),
        this.store.pipe(select(selectItemsPorPagina))
      ),
      map(([_, state, paginaActual, itemsPorPagina]) => {
        const inicio = (paginaActual - 1) * itemsPorPagina;
        const productosVisibles = state.productos.slice(inicio, inicio + itemsPorPagina);

        return setProductosVisibles({ productosVisibles });
      })
    )
  );

  constructor(private actions$: Actions, private store: Store<AppState>) {}
}

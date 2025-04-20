import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from './tabla.state';

@Injectable()
export class TablaEffects {
  /**
   * Placeholder sin efectos activos.
   * Evita errores de NgRx al registrar efectos vacíos.
   */
  efectoPlaceholder$ = createEffect(() => EMPTY, { dispatch: false });

  constructor(private actions$: Actions, private store: Store<AppState>) {}
}

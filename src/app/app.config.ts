import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { filterReducer } from './state/Filtros_NgRx/filter.reducer';
import { tablaReducer } from './state/tabla_NgRx/tabla.reducer';
import { provideHttpClient } from '@angular/common/http'; // ✅ Importado correctamente

/**
 * ✅ Configuración principal de la aplicación.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * ✅ Habilita la detección de cambios con Zone.js para mejorar el rendimiento.
     */
    provideZoneChangeDetection({ eventCoalescing: true }),

    /**
     * ✅ Configuración de rutas para la aplicación.
     */
    provideRouter(routes),
    RouterModule,

    /**
     * ✅ Cliente HTTP para consumir servicios REST (necesario para HttpClient)
     */
    provideHttpClient(), // ✅ Añadido aquí

    /**
     * ✅ Configuración de NgRx para el estado global. (Este nombre debe coincidir con lo que usas en selectors y componentes)
     */
    provideStore({
      filters: filterReducer,
      tabla: tablaReducer 
    }),

    /**
     * ✅ Habilita Redux Devtools para la depuración.
     */
    provideStoreDevtools(),
  ]
};

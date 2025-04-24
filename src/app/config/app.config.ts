import { provideHttpClient, withInterceptors } from '@angular/common/http' // ✅ Importado correctamente
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideRouter, RouterModule } from '@angular/router'
import { provideStore } from '@ngrx/store'
import { provideStoreDevtools } from '@ngrx/store-devtools'
import { routes } from '@routes/app.routes'
import { filterReducer } from '../shared/stores/Filtros_NgRx/filter.reducer'
import { tablaReducer } from '../shared/stores/tabla_NgRx/tabla.reducer'
import { AuthInterceptor } from '../interceptors/request.interceptor'


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
    provideHttpClient(withInterceptors([AuthInterceptor])), 


    /**
     * ✅ Configuración de NgRx para el estado global. (Este nombre debe coincidir con lo que usas en selectors y componentes)
     */
    provideStore({
      filters: filterReducer,
      tabla: tablaReducer,
    }),

    /**
     * ✅ Habilita Redux Devtools para la depuración.
     */
    provideStoreDevtools(),
  ],
}

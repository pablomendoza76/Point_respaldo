import { provideHttpClient, withInterceptors } from '@angular/common/http' // ✅ Importado correctamente
import { ApplicationConfig, importProvidersFrom, provideEnvironmentInitializer, provideZoneChangeDetection } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter, RouterModule } from '@angular/router'
import { authInterceptor } from '@auth/functions/auth.interceptor'
import { provideStore } from '@ngrx/store'
import { provideStoreDevtools } from '@ngrx/store-devtools'
import { routes } from '@routing/app.routes'
import { filterReducer } from '@stores/Filtros_NgRx/filter.reducer'
import { tablaReducer } from '@stores/tabla_NgRx/tabla.reducer'
import { IconService } from 'src/app/icons/services/icon.service'

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
    provideHttpClient(withInterceptors([authInterceptor])),

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
    provideAnimations(),
    importProvidersFrom(MatIconModule),
    provideEnvironmentInitializer(
      () => [IconService], // Dependencies
    ),
  ],
}

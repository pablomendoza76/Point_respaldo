import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, map } from 'rxjs'
import { ApiUrls } from '../../enums/api-urls.enum'
import { Enums_Regimen } from '../../enums/enums_sin_identificar/regimen.enums' // Asegúrate de importar el enum correcto

@Injectable({
  providedIn: 'root',
})
export class RegimenService {
  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de regímenes desde el API.
   *
   * @returns Observable con la lista de regímenes
   */
  getRegimenes(): Observable<any[]> {
    const url = `${ApiUrls.Base_Url}${Enums_Regimen.regimen}${Enums_Regimen.todas}`
    console.log('[DEBUG] URL getRegimenes:', url) // Verifica la URL exacta

    return this.http.get<any>(url).pipe(
      map((response: any) => {
        console.log('[DEBUG] Respuesta getRegimenes:', response) // Verifica la estructura del response
        return response?.respuesta?.datos?.datos || []
      }),
    )
  }

  /**
   * Crea un nuevo régimen en el sistema.
   *
   * @param regimen Objeto con los datos del régimen a crear
   * @returns Observable con la respuesta del API
   */
  crearRegimen(regimen: any): Observable<any> {
    const url = `${ApiUrls.Base_Url}${Enums_Regimen.regimen}${Enums_Regimen.crear}`
    return this.http.post<any>(url, regimen)
  }

  /**
   * Actualiza un régimen existente.
   *
   * @param regimen Objeto con los datos actualizados del régimen
   * @returns Observable con la respuesta del API
   */
  actualizarRegimen(regimen: any): Observable<any> {
    const url = `${ApiUrls.Base_Url}${Enums_Regimen.regimen}${Enums_Regimen.actualizar}`
    return this.http.put<any>(url, regimen)
  }

  /**
   * Elimina un régimen por su identificador.
   *
   * @param id Identificador único del régimen
   * @returns Observable con la respuesta del API
   */
  eliminarRegimen(id: number): Observable<any> {
    const url = `${ApiUrls.Base_Url}${Enums_Regimen.regimen}${Enums_Regimen.eliminar}/${id}`
    return this.http.delete<any>(url)
  }
}

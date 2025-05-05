import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, map } from 'rxjs'
import { ApiUrls } from '../../enums/api-urls.enum'
import { Enums_Cuentas } from '../../enums/enums_Cuentas/cuentas.enum' // Asegúrate de definir este enum

@Injectable({
  providedIn: 'root',
})
export class CuentasContablesService {
  constructor(private http: HttpClient) {}

  /**
   * Llama al endpoint de cuentas contables y devuelve el arreglo de cuentas.
   * @returns Observable con las cuentas contables { codigo, nombre, descripcion, ... }
   */
  getCuentasContables(): Observable<any[]> {
    const url = `${ApiUrls.Base_Url}${Enums_Cuentas.cuentas}${Enums_Cuentas.todas}`
    return this.http.get<any>(url).pipe(
      map((response: any) => {
        return response?.respuesta?.datos || []
      }),
    )
  }

  /**
   * Envía una nueva cuenta contable al backend.
   * @param cuenta Nueva cuenta contable a registrar.
   * @returns Observable con la respuesta del servidor.
   */
  crearCuentaContable(cuenta: any): Observable<any> {
    const url = `${ApiUrls.Base_Url}${Enums_Cuentas.cuentas}${Enums_Cuentas.todas}`
    return this.http.post<any>(url, cuenta)
  }
}

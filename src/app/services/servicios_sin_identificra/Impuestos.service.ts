import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiUrls } from '../../enums/api-urls.enum';
import { Enums_Impuestos } from '../../enums/enums_sin_identificar/Impuestos.enums';

@Injectable({
  providedIn: 'root'
})
export class ImpuestosService {
  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de todos los tipos de impuestos.
   *
   * @returns Observable con los impuestos disponibles
   */
  getImpuestos(): Observable<any[]> {
    const url = `${ApiUrls.Base_Url}${Enums_Impuestos.impuesta}${Enums_Impuestos.todas}`;
    return this.http.get<any>(url).pipe(
      map((response: any) => response?.respuesta?.datos?.datos || [])
    );
  }
  

  /**
 * Obtiene las tarifas de impuesto según su tipo (IVA, ICE, etc.).
 *
 * @param tipoId - Identificador del tipo de impuesto
 * @returns Observable con las tarifas asociadas a ese tipo
 */
  getImpuestosPorTipo(tipoId: number): Observable<any[]> {
    const url = `${ApiUrls.Base_Url}${Enums_Impuestos.impuesta}${Enums_Impuestos.tipo}?page=1&limit=10&impuestoId=${tipoId}`;
    console.log('[DEBUG][URL] getImpuestosPorTipo:', url);
  
    return this.http.get<any>(url).pipe(
      map((response: any) => {
        console.log('[DEBUG][RESPONSE] getImpuestosPorTipo:', response);
  
        // Devuelve array si está plano o busca en estructura anidada
        if (Array.isArray(response)) {
          return response;
        }
  
        return response?.respuesta?.datos?.datos || response?.respuesta?.datos || [];
      })
    );
  }
  
  

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiUrls } from '../../enums/api-urls.enum';
import { Enums_grupo } from '../../enums/enums_Productos/grupos.enum';

@Injectable({
  providedIn: 'root'
})
export class TarifasService {
  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de grupos con sus respectivas tarifas desde el API.
   * Usa enums para construir dinámicamente la URL del endpoint.
   *
   * @returns Observable con la lista de grupos y tarifas
   */
  getGruposConTarifas(): Observable<any[]> {
    const url = `${ApiUrls.Base_Url}${Enums_grupo.grupos}${Enums_grupo.todas}`;
    return this.http.get<any>(url).pipe(
      map((response: any) => response?.respuesta?.datos || [])
    );
  }
}

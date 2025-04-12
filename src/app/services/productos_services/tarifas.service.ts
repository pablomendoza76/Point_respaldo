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

  /**
   * Envía un nuevo grupo con tarifas al API.
   *
   * @param grupo - Objeto que representa el grupo con sus datos y tarifas
   * @returns Observable con la respuesta del API
   */
  agregarGrupo(grupo: any): Observable<any> {
    const url = `${ApiUrls.Base_Url}${Enums_grupo.grupos}${Enums_grupo.crear}`;
    return this.http.post<any>(url, grupo);
  }

  /**
   * Actualiza un grupo existente con nuevas tarifas.
   *
   * @param grupo - Objeto con los datos del grupo a actualizar
   * @returns Observable con la respuesta del API
   */
  actualizarGrupo(grupo: any): Observable<any> {
    const url = `${ApiUrls.Base_Url}${Enums_grupo.grupos}${Enums_grupo.actualizar}`;
    return this.http.put<any>(url, grupo);
  }

  /**
   * Elimina un grupo por su código.
   *
   * @param codigo - Código único del grupo a eliminar
   * @returns Observable con la respuesta del API
   */
  eliminarGrupo(codigo: number): Observable<any> {
    const url = `${ApiUrls.Base_Url}${Enums_grupo.grupos}${Enums_grupo.eliminar}/${codigo}`;
    return this.http.delete<any>(url);
  }
}

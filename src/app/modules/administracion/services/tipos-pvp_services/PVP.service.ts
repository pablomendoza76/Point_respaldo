import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiUrls } from '../../enums/api-urls.enum';
import { Enums_Tipos_Pvp } from '../../enums/enums_tipos_pvp/tipos_pvp.enum';

@Injectable({
  providedIn: 'root',
})
export class TiposPvpService {
  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los tipos de precio PVP disponibles.
   * @returns Observable con arreglo de tipos PVP [{ tipoprecio, descripcion, alias, activo }]
   */
  getTiposPvp(): Observable<Array<{ tipoprecio: string; descripcion: string; alias: string; activo: number }>> {
    const url = `${ApiUrls.Base_Url}${Enums_Tipos_Pvp.Tipos_Pvp}${Enums_Tipos_Pvp.todos}`;
    return this.http.get<any>(url).pipe(
      map((response: any) => response?.respuesta?.datos || [])
    );
  }

  /**
   * Crea un nuevo tipo de PVP.
   * @param tipoPvp Objeto con los datos del tipo de precio a crear.
   * @returns Observable con la respuesta del servidor.
   */
  crearTipoPvp(tipoPvp: { tipoprecio: string; descripcion: string; alias: string; activo: number }): Observable<any> {
    const url = `${ApiUrls.Base_Url}${Enums_Tipos_Pvp.Tipos_Pvp}${Enums_Tipos_Pvp.Crear}`;
    return this.http.post<any>(url, tipoPvp);
  }
}

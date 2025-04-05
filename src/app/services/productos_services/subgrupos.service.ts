import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiUrls } from '../../enums/api-urls.enum';
import { Enums_sub_grupo } from '../../enums/enums_Productos/sub_grupos.enum';

@Injectable({
  providedIn: 'root'
})
export class SubproductoService {
  constructor(private http: HttpClient) {}

  /**
   * Obtiene los subproductos desde el API.
   * Usa los enums para construir la URL correspondiente.
   *
   * @returns Observable con la lista de subproductos
   */
  getSubproductos(): Observable<any[]> {
    const url = `${ApiUrls.Base_Url}${Enums_sub_grupo.sub_grupo}${Enums_sub_grupo.todos}`;
    return this.http.get<any>(url).pipe(
      map((response: any) => response?.respuesta?.datos || [])
    );
  }
}

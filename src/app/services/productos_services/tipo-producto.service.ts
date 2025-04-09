import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiUrls } from '../../enums/api-urls.enum';
import { Enums_tipo_producto } from '../../enums/enums_Productos/tipo_producto.enum';
import { TipoProducto } from '../../Interfaces/Productos/tipoProducto.model';

@Injectable({
  providedIn: 'root'
})
export class TipoProductoService {
  constructor(private http: HttpClient) {}

  /**
   * Obtiene los tipos de productos desde el API.
   * Usa los enums para construir la URL correspondiente.
   *
   * @returns Observable con la lista de tipos de productos
   */
  getTiposProductos(): Observable<TipoProducto[]> {
    const url = `${ApiUrls.Base_Url}${Enums_tipo_producto.Tipos}${Enums_tipo_producto.todas}`;
    return this.http.get<any>(url).pipe(
      map((response: any) => response?.respuesta?.datos as TipoProducto[])
    );
  }

  /**
   * Envía un nuevo tipo de producto al API.
   * 
   * @param data Objeto con los datos del tipo de producto
   * @returns Respuesta del API
   */
  crearTipoProducto(data: TipoProducto): Observable<any> {
    const url = `${ApiUrls.Base_Url}${Enums_tipo_producto.Tipos}${Enums_tipo_producto.Crear}`;
    return this.http.post<any>(url, data);
  }
}

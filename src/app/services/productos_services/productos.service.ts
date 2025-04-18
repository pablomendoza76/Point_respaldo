import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../enums/api-urls.enum';
import { Enums_productos } from '../../enums/enums_Productos/productos.enum';
import { Producto } from '../../Interfaces/Productos/producto.model';
import { map } from 'rxjs/operators';


/**
 * Servicio que se encarga exclusivamente de la comunicación con la API.
 * Toda la transformación de datos es delegada al adaptador.
 */
@Injectable({
  providedIn: 'root'
})
export class AdministracionServicios {
  constructor(private http: HttpClient) {}

  /**
   * Llama al endpoint para obtener productos paginados (respuesta cruda).
   * @param page Número de página
   * @param limit Cantidad de elementos por página
   */
  obtenerProductosYColumnas(
    page: number = 1,
    limit: number = 0
  ): Observable<any> {
    const url = `${ApiUrls.Base_Url}${Enums_productos.Productos}${Enums_productos.todos}?page=${page}&limit=${limit}`;
    return this.http.get<any>(url);
  }

  /**
   * Obtiene opciones para el campo origen del producto.
   */
  getOrigen(): Observable<Array<{ id: number; nombre: string; descripcion: string }>> {
    const url = `${ApiUrls.Base_Url}${Enums_productos.Productos}${Enums_productos.Origen}`;
    return this.http.get<any>(url).pipe(
      map((response: any) => {
        console.log('Respuesta completa de getOrigen:', response);
        return response?.respuesta?.datos?.datos || [];
      })
    );
  }
  

  /**
   * Llama al endpoint de edición de producto. No transforma el objeto.
   * La transformación debe hacerse previamente (por el adaptador).
   */
  editarProducto(codigo: number, productoAdaptado: Producto): Observable<any> {
    const url = `${ApiUrls.Base_Url}${Enums_productos.Productos}${Enums_productos.Editar}/${codigo}`;
    return this.http.put(url, productoAdaptado);
  }

  /**
   * Llama al endpoint de creación de producto. No transforma el objeto.
   * La transformación debe hacerse previamente (por el adaptador).
   */
  crearProducto(productoAdaptado: Producto): Observable<any> {
    const url = `${ApiUrls.Base_Url}${Enums_productos.Productos}${Enums_productos.Crear}`;
    return this.http.post(url, productoAdaptado);
  }
}

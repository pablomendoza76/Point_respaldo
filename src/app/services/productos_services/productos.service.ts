import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiUrls } from '../../enums/api-urls.enum';
import { Enums_productos } from '../../enums/enums_Productos/productos.enum';
import { Producto } from '../../Interfaces/Productos/producto.model';
import { adaptarProducto } from '../../adapters/producto-adapter';

/**
 * Servicio encargado de obtener productos desde la API y delegar
 * la transformación de datos al adaptador correspondiente.
 */
@Injectable({
  providedIn: 'root'
})
export class AdministracionServicios {
  constructor(private http: HttpClient) {}

  /**
   * Obtiene productos paginados desde la API.
   * La transformación de datos se realiza en el adaptador.
   *
   * @param page Página actual
   * @param limit Cantidad de productos por página
   * @returns Observable con productos tipados, columnas, marcas, grupos y total
   */
  obtenerProductosYColumnas(
    page: number = 1,
    limit: number = 0
  ): Observable<{
    productos: Producto[];
    columnas: { name: string; key: string; selected: boolean }[];
    marcas: string[];
    grupos: string[];
    total: number;
  }> {
    const url = `${ApiUrls.Base_Url}${Enums_productos.Productos}${Enums_productos.todos}?page=${page}&limit=${limit}`;
    return this.http.get<any>(url).pipe(
      map(response => adaptarProducto.desdeApi(response))
    );
  }


  getOrigen(): Observable<Array<{ id: number; nombre: string; descripcion: string }>> {
      const url = `${ApiUrls.Base_Url}${Enums_productos.Productos}${Enums_productos.Origen}`;
  
      return this.http.get<any>(url).pipe(
        map((response: any) => {
          return response?.respuesta?.datos || [];
        })
      );
    }

  /**
   * Envía una solicitud para actualizar un producto existente.
   * El objeto enviado es procesado por el adaptador antes de enviarse.
   *
   * @param codigo ID del producto a editar
   * @param data Datos del producto
   * @returns Observable con respuesta del backend
   */
  editarProducto(codigo: number, data: Partial<Producto>): Observable<any> {
    const url = `${ApiUrls.Base_Url}${Enums_productos.Productos}${Enums_productos.Editar}/${codigo}`;
    const producto = adaptarProducto.prepararParaEdicion(data as Producto);
    return this.http.put(url, producto);
  }

  /**
   * Envía una solicitud para crear un nuevo producto.
   * Los campos como fechas y `codigo` se agregan automáticamente en el adaptador.
   *
   * @param data Datos del nuevo producto
   * @returns Observable con respuesta del backend
   */
  crearProducto(data: Partial<Producto>): Observable<any> {
    const url = `${ApiUrls.Base_Url}${Enums_productos.Productos}${Enums_productos.Crear}`;
    const producto = adaptarProducto.prepararParaCreacion(data as Producto);
    return this.http.post(url, producto);
  }
}

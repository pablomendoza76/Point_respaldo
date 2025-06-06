import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, map } from 'rxjs'
import { ApiUrls } from '../../enums/api-urls.enum'
import { Enums_categoria } from '../../enums/enums_Productos/categoria.enum'

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  constructor(private http: HttpClient) {}

  /**
   * Llama directamente al endpoint de Categorias y devuelve los datos completos.
   * @returns Observable con el arreglo de Categorias.
   */
  getCategoria(): Observable<Array<{ id: number; nombre: string; descripcion: string }>> {
    const url = `${ApiUrls.Base_Url}${Enums_categoria.categorias}${Enums_categoria.todas}`
    return this.http.get<any>(url).pipe(
      map((response: any) => {
        return response?.respuesta?.datos || []
      }),
    )
  }

  /**
   * Llenvia los datos a point para crear una Categoria.
   * @returns Observable con el arreglo de marcas {nombre, descripcion } // ne l id es autogenrado
   */

  crearCategoria(marca: { nombre: string; descripcion: string }): Observable<any> {
    const url = `${ApiUrls.Base_Url}${Enums_categoria.categorias}${Enums_categoria.crear}`
    return this.http.post<any>(url, marca)
  }
}

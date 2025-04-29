import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, map } from 'rxjs'
import { ApiUrls } from '../../enums/api-urls.enum'
import { Enums_subcategoria } from '../../enums/enums_Productos/subcategoria.enum'

@Injectable({
  providedIn: 'root',
})
export class SubcategoriaService {
  constructor(private http: HttpClient) {}

  /**
   * Llama directamente al endpoint de Subcategoria y devuelve los datos completos.
   * @returns Observable con el arreglo de Subcategoria
   */
  getSubcategoria(): Observable<Array<{ id: number; nombre: string; descripcion: string }>> {
    const url = `${ApiUrls.Base_Url}${Enums_subcategoria.subcategoria}${Enums_subcategoria.todas}`
    return this.http.get<any>(url).pipe(
      map((response: any) => {
        return response?.respuesta?.datos || []
      }),
    )
  }

  /**
     * Obtiene las subcategorias correspondientes a un grupo específico.
     *
     * @param idCategoria - ID de la categoria  para el cual se desean obtener las subcategorias
     * @returns Observable con la lista de subgrupos del grupo solicitado
     */
    getSubCategoriaPorCategoria(idCategoria: number): Observable<any[]> {
      const url = `${ApiUrls.Base_Url}${Enums_subcategoria.subcategoria}${Enums_subcategoria.por_categoria}${idCategoria}`
      return this.http.get<any>(url).pipe(map((response: any) => response?.respuesta?.datos || []))
    }

  /**
   * Llenvia los datos a point para crear una Subcategoria
   * @returns Observable con el arreglo de Subcategoria 
   */

  crearSubcategoria(marca: { nombre: string; descripcion: string }): Observable<any> {
    const url = `${ApiUrls.Base_Url}${Enums_subcategoria.subcategoria}${Enums_subcategoria.crear}`
    return this.http.post<any>(url, marca)
  }
}

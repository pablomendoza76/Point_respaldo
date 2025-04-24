import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, map } from 'rxjs'
import { ApiUrls } from '../../enums/api-urls.enum'
import { Enums_marcas } from '../../enums/enums_Productos/marcas.enum'

@Injectable({
  providedIn: 'root',
})
export class MarcasService {
  constructor(private http: HttpClient) {}

  /**
   * Llama directamente al endpoint de marcas y devuelve los datos completos.
   * @returns Observable con el arreglo de marcas { id, nombre, descripcion }
   */
  getMarcas(): Observable<Array<{ id: number; nombre: string; descripcion: string }>> {
    const url = `${ApiUrls.Base_Url}${Enums_marcas.Marcas}${Enums_marcas.todas}`
    return this.http.get<any>(url).pipe(
      map((response: any) => {
        return response?.respuesta?.datos || []
      }),
    )
  }

  /**
   * Llenvia los datos a point para crear una marca
   * @returns Observable con el arreglo de marcas {nombre, descripcion } // ne l id es autogenrado
   */

  crearMarca(marca: { nombre: string; descripcion: string }): Observable<any> {
    const url = `${ApiUrls.Base_Url}${Enums_marcas.Marcas}${Enums_marcas.Crear}`
    return this.http.post<any>(url, marca)
  }
}

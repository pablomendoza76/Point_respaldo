/**
 * Servicio encargado de obtener productos desde la API y generar dinámicamente las columnas,
 * además de extraer información útil como marcas y grupos para filtros.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministracionServicios {
  /**
   * URL base del servicio para obtener productos desde la API externa.
   */
  private readonly URL_API = 'http://164.90.131.145:3000/bill-producto/obtener-todos-productos?page=1&limit=1000';

  constructor(private http: HttpClient) {}

  /**
   * Llama al endpoint para obtener todos los productos y genera:
   * - Lista de productos procesados
   * - Columnas visibles a partir del primer producto
   * - Marcas únicas
   * - Grupos únicos
   *
   * @returns Observable con productos, columnas, marcas y grupos
   */
  obtenerProductosYColumnas(): Observable<{ productos: any[]; columnas: any[]; marcas: string[]; grupos: string[] }> {
    return this.http.get<any>(this.URL_API).pipe(
      map((response: any) => {
        const productosRaw = response?.respuesta?.datos?.productos || [];

        if (!Array.isArray(productosRaw) || productosRaw.length === 0) {
          return { productos: [], columnas: [], marcas: [], grupos: [] };
        }

        // Adaptar productos si es necesario (por ejemplo cambiar nombres de claves o asegurarse de que existan)
        const productos = productosRaw.map(p => ({
          ...p,
          nombre: p.nombreUnico || p.nombre || '',
          grupo: p.productogrupoCodigo,
          marca: p.marcaId,
          precio: p.pvpServicio || p.pvppromo || 0,
          stock: p.stockactual || 0
        }));

        // Obtener el primer producto para generar columnas
        const primerProducto = productos[0];
        const columnas = Object.keys(primerProducto).map((key) => ({
          name: this.formatearNombre(key),
          key,
          selected: ['codigo', 'nombre', 'precio', 'stock', 'grupo', 'marca'].includes(key)
        }));

        // Extraer marcas y grupos únicos
        const marcas = this.extraerValoresUnicos(productos, 'marca');
        const grupos = this.extraerValoresUnicos(productos, 'grupo');

        return { productos, columnas, marcas, grupos };
      })
    );
  }

  /**
   * Convierte una clave de objeto a un nombre legible para columnas.
   * @param key Clave cruda del objeto
   * @returns Nombre legible
   */
  private formatearNombre(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }

  /**
   * Extrae valores únicos de una lista de productos para una clave específica
   * @param productos Lista de productos
   * @param key Clave a extraer
   * @returns Lista de valores únicos como strings
   */
  private extraerValoresUnicos(productos: any[], key: string): string[] {
    return Array.from(new Set(productos.map(p => p[key]).filter(Boolean))).map(v => String(v));
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../enums/api-urls.enum';
import { Enums_productos } from '../../enums/enums_Productos/productos.enum';
import { Producto } from '../../Interfaces/Productos/producto.model';

/**
 * Servicio encargado de obtener productos desde la API y generar dinámicamente las columnas,
 * además de extraer información útil como marcas y grupos para filtros.
 */
@Injectable({
  providedIn: 'root'
})
export class AdministracionServicios {
  constructor(private http: HttpClient) {}

  /**
   * Llama al endpoint para obtener productos paginados y genera:
   * - Lista de productos procesados
   * - Columnas visibles a partir del primer producto
   * - Marcas únicas
   * - Grupos únicos
   */
  obtenerProductosYColumnas(
    page: number = 1,
    limit: number = 0
  ): Observable<{
    productos: Producto[];
    columnas: any[];
    marcas: string[];
    grupos: string[];
    total: number;
  }> {
    const url = `${ApiUrls.Base_Url}${Enums_productos.Productos}${Enums_productos.todos}?page=${page}&limit=${limit}`;

    return this.http.get<any>(url).pipe(
      map((response: any) => {
        const productosRaw = response?.respuesta?.datos?.datos || [];
        const total = response?.respuesta?.datos?.total || productosRaw.length;
        console.log(response)

        console.log(response)
        if (!Array.isArray(productosRaw) || productosRaw.length === 0) {
          return { productos: [], columnas: [], marcas: [], grupos: [], total };
        }

        const productos: Producto[] = productosRaw.map(p => this.transformarProducto(p));

        const primerProducto = productos[0];
        const columnas = Object.keys(primerProducto).map(key => ({
          name: this.formatearNombre(key),
          key,
          selected: ['codigo', 'nombreUnico', 'precio', 'stockactual', 'productogrupoCodigo', 'marcaId'].includes(key)
        }));

        const marcas = this.extraerValoresUnicos(productos, 'marcaId');
        const grupos = this.extraerValoresUnicos(productos, 'productogrupoCodigo');

        return { productos, columnas, marcas, grupos, total };
      })
    );
  }

  /**
   * Transforma un producto crudo a objeto con tipos correctos.
   * Convierte fechas y strings numéricos a su tipo correspondiente.
   */
  private transformarProducto(producto: any): any {
    const fechas: string[] = [
      'fechacreacion', 'fechaultactualizacion', 'finpvppromo', 'fechafinpromo',
      'prodFechaCaducidad', 'fechaDestacado', 'fechaCompra'
    ];
  
    const resultado: any = {};
  
    for (const key in producto) {
      const valor = producto[key];
  
      // Normalizar fechas
      if (fechas.includes(key)) {
        if (!valor || valor === 'Invalid Date') {
          resultado[key] = null;
        } else if (valor instanceof Date) {
          resultado[key] = valor.toISOString();
        } else if (typeof valor === 'string' && !isNaN(Date.parse(valor))) {
          resultado[key] = new Date(valor).toISOString();
        } else {
          resultado[key] = null;
        }
      }
  
      // Normalizar números
      else if (typeof valor === 'string' && valor.trim() === '') {
        resultado[key] = null;
      } else if (typeof valor === 'string' && !isNaN(Number(valor))) {
        resultado[key] = Number(valor);
      } else if (typeof valor === 'number') {
        resultado[key] = valor;
      }
  
      // Normalizar booleanos (si llegan como número)
      else if (valor === 0 || valor === 1) {
        resultado[key] = valor;
      }
  
      // Normalizar strings
      else if (typeof valor === 'string') {
        resultado[key] = valor;
      }
  
      // Default a null
      else {
        resultado[key] = valor ?? null;
      }
    }
  
    return resultado;
  }

  /**
   * Convierte una clave de objeto a un nombre legible para columnas.
   */
  private formatearNombre(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }

  /**
   * Extrae valores únicos de una lista de productos para una clave específica.
   */
  private extraerValoresUnicos(productos: any[], key: string): string[] {
    return Array.from(new Set(productos.map(p => p[key]).filter(Boolean))).map(v => String(v));
  }

  /**
   * Envía una solicitud para editar un producto.
   */
  editarProducto(codigo: number, data: Partial<Producto>): Observable<any> {
    const url = `${ApiUrls.Base_Url}${Enums_productos.Productos}${Enums_productos.Editar}/${codigo}`;

    const productoActualizado: Producto = {
      ...<Producto>{},
      ...data,
      fechaultactualizacion: new Date().toISOString()
    };

    return this.http.put(url, productoActualizado);
  }

  /**
   * Envía una solicitud para crear un nuevo producto.
   */
  crearProducto(data: Partial<Producto>): Observable<any> {
    const url = `${ApiUrls.Base_Url}${Enums_productos.Productos}${Enums_productos.Crear}`;

    const producto: Producto = {
      ...<Producto>{},
      ...data,
      codigo: 0,
      fechacreacion: new Date().toISOString(),
      fechaultactualizacion: new Date().toISOString()
    };

    return this.http.post(url, producto);
  }
}

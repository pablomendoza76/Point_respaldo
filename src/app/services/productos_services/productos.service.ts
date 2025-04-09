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
   *
   * @param page Página actual
   * @param limit Número de productos por página
   * @returns Observable con productos, columnas, marcas, grupos y total
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
        const productosRaw = response?.respuesta?.datos?.productos || [];
        const total = response?.respuesta?.datos?.total || productosRaw.length;

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
   * Transforma un objeto recibido de la API a un objeto `Producto` con tipos correctos.
   * @param p Producto crudo recibido desde la API
   * @returns Producto transformado
   */
  /**
 * Transforma un producto recibido al formato correcto para la API.
 * Asegura tipos válidos según la interfaz Producto.
 * @param producto Objeto original del producto
 * @returns Objeto transformado con tipos correctos
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
   * @param key Clave cruda del objeto
   * @returns Nombre legible
   */
  private formatearNombre(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }

  /**
   * Extrae valores únicos de una lista de productos para una clave específica.
   * @param productos Lista de productos
   * @param key Clave a extraer
   * @returns Lista de valores únicos como strings
   */
  private extraerValoresUnicos(productos: any[], key: string): string[] {
    return Array.from(new Set(productos.map(p => p[key]).filter(Boolean))).map(v => String(v));
  }

  /**
   * Edita un producto enviando un JSON actualizado al endpoint correspondiente.
   * 
   * @param codigo Código del producto a editar.
   * @param data Datos actualizados del producto en formato JSON.
   * @returns Observable con la respuesta del servidor.
   */
  editarProducto(codigo: number, data: any): Observable<any> {
    const url = `${ApiUrls.Base_Url}${Enums_productos.Productos}${Enums_productos.Editar}/${codigo}`;

    return this.http.put<any>(url, data).pipe(
      map(response => {
        return response;
      })
    );
  }

  /**
 * Envía una solicitud para crear un nuevo producto.
 * @param producto Datos del nuevo producto
 * @returns Observable con la respuesta del servidor
 */

crearProducto(data: Partial<Producto>): Observable<any> {
  const url = `${ApiUrls.Base_Url}${Enums_productos.Productos}${Enums_productos.Crear}`;

  const producto: Producto = {
    ...<Producto>{},  // Cast a Producto vacío
    ...data,
    codigo: 0,  // obligatorio según API
    fechacreacion: new Date().toISOString(),
    fechaultactualizacion: new Date().toISOString()
  };

  console.log(url, producto)
  return this.http.post(url, producto);
}

}

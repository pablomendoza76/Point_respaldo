import { Producto } from '../Interfaces/Productos/producto.model';

/**
 * Convierte un objeto crudo recibido desde la API a un objeto tipado `Producto`.
 * Transforma fechas ISO, strings vacíos y números válidos.
 */
function transformarProducto(producto: any): Producto {
  const camposFecha = [
    'fechacreacion', 'fechaultactualizacion', 'finpvppromo', 'fechafinpromo',
    'prodFechaCaducidad', 'fechaDestacado', 'fechaCompra'
  ];

  const resultado: any = {};

  for (const key in producto) {
    const valor = producto[key];

    if (camposFecha.includes(key)) {
      resultado[key] = valor && !isNaN(Date.parse(valor)) ? new Date(valor).toISOString() : null;
    } else if (typeof valor === 'string' && valor.trim() === '') {
      resultado[key] = null;
    } else if (!isNaN(Number(valor)) && valor !== null && valor !== '') {
      resultado[key] = Number(valor);
    } else {
      resultado[key] = valor ?? null;
    }
  }

  return resultado as Producto;
}

/**
 * Convierte una clave técnica en un nombre legible para mostrar como columna.
 */
function formatearNombre(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}

/**
 * Adaptador principal para transformar datos de productos desde y hacia el API.
 */
export const adaptarProducto = {
  /**
   * Transforma la respuesta cruda de la API en una estructura usable en la app.
   * Incluye los productos tipados, columnas legibles, marcas y grupos únicos.
   */
  desdeApi(response: any): {
    productos: Producto[];
    columnas: { name: string; key: string; selected: boolean }[];
    marcas: string[];
    grupos: string[];
    total: number;
  } {
    const productosRaw = response?.respuesta?.datos?.datos || [];
    const total = response?.respuesta?.datos?.total || productosRaw.length;

    if (!Array.isArray(productosRaw) || productosRaw.length === 0) {
      return { productos: [], columnas: [], marcas: [], grupos: [], total };
    }

    const productos = productosRaw.map(transformarProducto);

    const columnas = Object.keys(productos[0]).map((key) => ({
      name: formatearNombre(key),
      key,
      selected: ['codigo', 'nombreUnico', 'precio', 'stockactual', 'productogrupoCodigo', 'marcaId'].includes(key)
    }));

    const marcas = Array.from(new Set(productos.map(p => p.marcaId).filter(Boolean))).map(String);
    const grupos = Array.from(new Set(productos.map(p => p.productogrupoCodigo).filter(Boolean))).map(String);

    return { productos, columnas, marcas, grupos, total };
  },

  /**
   * Prepara un producto tipado para ser enviado al backend en modo creación.
   * Formatea fechas como strings ISO y añade campos requeridos automáticamente.
   */
  prepararParaCreacion(producto: Producto): Producto {
    return {
      ...producto,
      prodFechaCaducidad: producto.prodFechaCaducidad
        ? new Date(producto.prodFechaCaducidad).toISOString()
        : null,
      codigo: 0,
      fechacreacion: new Date().toISOString(),
      fechaultactualizacion: new Date().toISOString()
    };
  },

  /**
   * Prepara un producto tipado para ser enviado al backend en modo edición.
   * Formatea fechas como strings ISO y actualiza la fecha de modificación.
   */
  prepararParaEdicion(producto: Producto): Producto {
    return {
      ...producto,
      prodFechaCaducidad: producto.prodFechaCaducidad
        ? new Date(producto.prodFechaCaducidad).toISOString()
        : null,
      fechaultactualizacion: new Date().toISOString()
    };
  }
};

import { Producto } from '../Interfaces/Productos/producto.model';

/**
 * Convierte un objeto crudo recibido desde la API a un objeto tipado `Producto`.
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
 * Diccionario de etiquetas legibles para campos.
 */
const etiquetasCampos: Record<string, string> = {
  nombreUnico: 'Nombre',
  descripcion: 'Descripción',
  productotipoId: 'Tipo de Producto',
  productogrupoCodigo: 'Grupo',
  idSubgrupo: 'Sub Grupo',
  marcaId: 'Marca',
  codbarras1: 'Código de Barras 1',
  codigo2: 'Código Común',
  codbarras2: 'Código de Barras 2',
  codbarras3: 'Código de Barras 3',
  codbarras4: 'Código de Barras 4',
  codbarras5: 'Código de Barras 5',
  existenciaMinima: 'Stock Mínimo',
  existenciaMaxima: 'Stock Máximo',
  proteinas: 'Proteínas',
  calorias: 'Calorías',
  unidadMedida: 'Unidad de Medida',
  pvpa: 'P.V.P. A',
  pvpb: 'P.V.P. B',
  pvpc: 'P.V.P. C',
  pvpd: 'P.V.P. D',
  pvpe: 'P.V.P. E',
  regimenProd: 'Régimen',
  iceporcent: 'ICE',
  ivaporcent: 'Impuesto (IVA)',
  origen: 'Origen',
  prodFechaCaducidad: 'Fecha de Caducidad',
  tiempo: 'Tiempo',
  descuentoActivo: 'Descuento (Sí/No)',
  especificaciones: 'Especificaciones (Sí/No)',
  tipoCuentaCosto: 'Cta.Cont.Costo',
  tipoCuenta: 'Cta.Cont.Compras(debe)',
  tipoCuentaVentas: 'Cta.Cont.Ventas(haber)'
};

/**
 * Adaptador principal para transformar datos de productos desde y hacia el API.
 */
export const adaptarProducto = {
  /**
   * Transforma la respuesta cruda de la API en una estructura usable en la app.
   * Permite mantener las columnas seleccionadas previamente.
   */
  desdeApi(
    response: any,
    columnasPrevias: { key: string; selected: boolean }[] = []
  ): {
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

    const columnas = Object.keys(productos[0]).map((key) => {
      const previa = columnasPrevias.find(c => c.key === key);
      return {
        name: formatearNombre(key),
        key,
        selected: previa ? previa.selected : [
          'codigo', 'nombreUnico', 'descripcion', 'precio',
          'stockactual', 'productogrupoCodigo', 'marcaId'
        ].includes(key)
      };
    });

    const marcas = Array.from(new Set(productos.map(p => p.marcaId).filter(Boolean))).map(String);
    const grupos = Array.from(new Set(productos.map(p => p.productogrupoCodigo).filter(Boolean))).map(String);

    return { productos, columnas, marcas, grupos, total };
  },

  /**
   * Prepara un producto tipado para ser enviado al backend en modo creación.
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
   */
  prepararParaEdicion(producto: Producto): Producto {
    return {
      ...producto,
      prodFechaCaducidad: producto.prodFechaCaducidad
        ? new Date(producto.prodFechaCaducidad).toISOString()
        : null,
      fechaultactualizacion: new Date().toISOString()
    };
  },

  /**
   * Genera bloques dinámicos para formulario usando los catálogos.
   */
  generarBloquesFormulario(
    producto: Producto,
    marcas: any[],
    grupos: any[],
    subgrupos: any[],
    tiposProducto: any[],
    cuentas: any[],
    onGrupoChange: (codigo: number) => void
  ): Array<{ titulo: string; campos: any[] }> {
    const camposAgrupados: Record<string, string[]> = {
      'Información Básica': [
        'nombreUnico', 'descripcion', 'productotipoId', 'productogrupoCodigo',
        'idSubgrupo', 'marcaId', 'codbarras1', 'codigo2'
      ],
      'Impuestos y Precios': [
        'pvpa', 'pvpb', 'pvpc', 'pvpd', 'pvpe',
        'regimenProd', 'iceporcent', 'ivaporcent'
      ],
      'Información Adicional': [
        'codbarras2', 'codbarras3', 'codbarras4', 'codbarras5',
        'existenciaMinima', 'existenciaMaxima', 'proteinas', 'calorias',
        'unidadMedida', 'origen', 'prodFechaCaducidad', 'tiempo',
        'descuentoActivo', 'especificaciones'
      ],
      'Cuentas': [
        'tipoCuentaCosto', 'tipoCuenta', 'tipoCuentaVentas'
      ]
    };

    const bloques: Array<{ titulo: string; campos: any[] }> = [];

    for (const [titulo, keys] of Object.entries(camposAgrupados)) {
      const campos = keys.map((key) => {
        let tipo = 'text';
        const valor = producto[key as keyof Producto];
        let opciones: any[] | undefined;

        if (typeof valor === 'number') tipo = 'number';
        if (typeof valor === 'string' && !isNaN(Date.parse(valor))) tipo = 'date';
        if (valor instanceof Date) tipo = 'date';

        if (['tipoCuentaCosto', 'tipoCuenta', 'tipoCuentaVentas'].includes(key)) {
          tipo = 'select';
          opciones = cuentas.map(c => ({ valor: c.id, texto: c.nombre }));
        }

        if (key === 'ivaporcent') {
          tipo = 'radio';
          opciones = [
            { valor: '0', etiqueta: 'IVA - TARIFA CERO 0%' },
            { valor: '15', etiqueta: 'IVA - TARIFA QUINCE 15%' },
            { valor: '99', etiqueta: 'IVA - NO OBJETO DE IMPUESTOS 0%' }
          ];
        }

        if (key === 'descuentoActivo' || key === 'especificaciones') {
          tipo = 'radio';
          opciones = [
            { valor: 'true', etiqueta: 'Sí' },
            { valor: 'false', etiqueta: 'No' }
          ];
        }

        if (key === 'productotipoId') {
          tipo = 'select';
          opciones = tiposProducto.map(t => ({ valor: t.id, texto: t.nombre }));
        }

        if (key === 'productogrupoCodigo') {
          tipo = 'select';
          opciones = grupos.map(g => ({ valor: g.codigo, texto: g.nombre }));

          return {
            key,
            label: etiquetasCampos[key] || key,
            tipo,
            opciones,
            required: false,
            onChange: (nuevoCodigo: any) => {
              const codigoNumerico = Number(nuevoCodigo);
              if (!isNaN(codigoNumerico)) {
                onGrupoChange(codigoNumerico);
              }
            }
          };
        }

        if (key === 'idSubgrupo') {
          tipo = 'select';
          opciones = subgrupos.map(s => ({ valor: s.idSub, texto: s.nombre }));
        }

        if (key === 'marcaId') {
          tipo = 'select';
          opciones = marcas.map(m => ({ valor: m.id, texto: m.nombre }));
        }

        return {
          key,
          label: etiquetasCampos[key] || key,
          tipo,
          opciones,
          required: false
        };
      });

      bloques.push({ titulo, campos });
    }

    return bloques;
  }
};

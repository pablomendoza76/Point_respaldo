import { map, forkJoin, switchMap, of, Observable, firstValueFrom } from 'rxjs'
import { Producto } from '../../Interfaces/Productos/producto.model'
import { CategoriaService } from '../../services/productos_services/categoria.service'
import { AdministracionServicios } from '../../services/productos_services/productos.service'
import { SubcategoriaService } from '../../services/productos_services/subcategoria.service'
import { ImpuestosService } from '../../services/servicios_sin_identificra/Impuestos.service'
import { RegimenService } from '../../services/servicios_sin_identificra/regimen.service'

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
  categoriaId: 'Categoría',
  subcategoriaId: 'Subcategoría',
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
  descuentoActivo: 'Descuento',
  especificaciones: 'Especificaciones',
  tipoCuentaCosto: 'Cta.Cont.Costo',
  tipoCuenta: 'Cta.Cont.Compras(debe)',
  tipoCuentaVentas: 'Cta.Cont.Ventas(haber)',
}

let opcionesExtras: {
  origen?: any[]
  regimenes?: any[]
  iva?: any[]
  ice?: any[]
  categorias?: any[]
  subcategorias?: any[]
} = {}

function transformarProducto(producto: any): Producto {
  const camposFecha = ['fechacreacion', 'fechaultactualizacion', 'finpvppromo', 'fechafinpromo', 'prodFechaCaducidad', 'fechaDestacado', 'fechaCompra']
  const camposNumericos = [
    'pvpa',
    'pvpb',
    'pvpc',
    'pvpd',
    'pvpe',
    'ivaporcent',
    'iceporcent',
    'regimenProd',
    'existenciaMinima',
    'existenciaMaxima',
    'valorMedida',
    'proteinas',
    'calorias',
    'tiempo',
  ]

  const result: any = {}

  for (const key in producto) {
    const valor = producto[key]

    if (camposFecha.includes(key)) {
      result[key] = valor && !isNaN(Date.parse(valor)) ? new Date(valor).toISOString() : null
    } else if (camposNumericos.includes(key)) {
      result[key] = valor === '' || valor === null ? null : Number(valor)
    } else if (['tipoCuenta', 'tipoCuentaCosto', 'tipoCuentaVentas'].includes(key)) {
      result[key] = typeof valor === 'string' ? valor : valor?.toString() ?? null
    } else if (typeof valor === 'string' && valor.trim() === '') {
      result[key] = null
    } else {
      result[key] = valor ?? null
    }
  }

  return result as Producto
}

function formatearNombre(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
}

export const adaptarProducto = {
  async cargarOpcionesGlobales(
    adminService: AdministracionServicios,
    regimenService: RegimenService,
    impuestosService: ImpuestosService,
    categoriaService: CategoriaService,
    subcategoriaService: SubcategoriaService,
  ): Promise<void> {
    return new Promise((resolve) => {
      const origen$ = adminService.getOrigen()
      const regimenes$ = regimenService.getRegimenes()
      const tipos$ = impuestosService.getImpuestos()
      const categorias$ = categoriaService.getCategoria()
      const subcategorias$ = subcategoriaService.getSubcategoria()

      forkJoin({ origen: origen$, regimenes: regimenes$, tipos: tipos$, categorias: categorias$, subcategorias: subcategorias$ })
        .pipe(
          switchMap(({ origen, regimenes, tipos, categorias, subcategorias }) => {
            const tipoIVA = tipos.find((t: any) => {
              const match = (t.impuesto || '').toLowerCase().includes('iva')
              if (match) console.debug('[DEBUG] Tipo IVA encontrado:', t)
              return match
            })

            const tipoICE = tipos.find((t: any) => t.impuesto?.toLowerCase().includes('ice'))

            const iva$ = tipoIVA?.id
              ? impuestosService.getImpuestosPorTipo(tipoIVA.id).pipe(
                  map((res: any) => {
                    console.log('[ADAPTADOR][DEBUG] Respuesta bruta getImpuestosPorTipo (IVA):', res)
                    return Array.isArray(res) ? res : res?.respuesta?.datos?.datos || res?.respuesta?.datos || []
                  }),
                )
              : of([])

            const ice$ = tipoICE?.id
              ? impuestosService.getImpuestosPorTipo(tipoICE.id).pipe(
                  map((res: any) => {
                    console.log('[ADAPTADOR][DEBUG] Respuesta bruta getImpuestosPorTipo (ICE):', res)
                    return Array.isArray(res) ? res : res?.respuesta?.datos?.datos || res?.respuesta?.datos || []
                  }),
                )
              : of([])

            return forkJoin({
              origen: of(origen),
              regimenes: of(regimenes),
              iva: iva$,
              ice: ice$,
              categorias: of(categorias),
              subcategorias: of(subcategorias),
            })
          }),
        )
        .subscribe({
          next: (res) => {
            opcionesExtras = res
            resolve()
          },
          error: () => {
            opcionesExtras = { origen: [], regimenes: [], iva: [], ice: [], categorias: [], subcategorias: [] }
            resolve()
          },
        })
    })
  },

  desdeApi(response: any, columnasPrevias: { key: string; selected: boolean }[] = []) {
    const productosRaw = response?.respuesta?.datos?.datos || []
    const total = response?.respuesta?.datos?.total || productosRaw.length

    if (!Array.isArray(productosRaw) || productosRaw.length === 0) {
      return { productos: [], columnas: [], marcas: [], grupos: [], total }
    }

    const productos = productosRaw.map(transformarProducto)
    const columnas = Object.keys(productos[0]).map((key) => ({
      name: formatearNombre(key),
      key,
      selected:
        columnasPrevias.find((c) => c.key === key)?.selected ?? ['codigo', 'nombreUnico', 'descripcion', 'precio', 'stockactual', 'productogrupoCodigo', 'marcaId'].includes(key),
    }))

    const marcas = [...new Set(productos.map((p) => p.marcaId).filter(Boolean))].map(String)
    const grupos = [...new Set(productos.map((p) => p.productogrupoCodigo).filter(Boolean))].map(String)

    return { productos, columnas, marcas, grupos, total }
  },

  prepararParaCreacion(producto: Producto): Producto {
    return {
      ...producto,
      codigo: 0,
      fechacreacion: new Date().toISOString(),
      fechaultactualizacion: new Date().toISOString(),
      prodFechaCaducidad: producto.prodFechaCaducidad ? new Date(producto.prodFechaCaducidad).toISOString() : null,
      descuentoActivo: producto.descuentoActivo ?? 0,
      especificaciones: producto.especificaciones ?? 0,
    }
  },

  prepararParaEdicion(producto: Producto): Producto {
    return {
      ...producto,
      prodFechaCaducidad: producto.prodFechaCaducidad ? new Date(producto.prodFechaCaducidad).toISOString() : null,
      fechaultactualizacion: new Date().toISOString(),
    }
  },

  obtenerProductosAdaptados(
    servicio: { obtenerProductosYColumnas: (p: number, l: number) => Observable<any> },
    pagina: number,
    limite: number,
    columnasPrevias: { key: string; selected: boolean }[] = [],
  ) {
    return servicio.obtenerProductosYColumnas(pagina, limite).pipe(map((respuesta) => this.desdeApi(respuesta, columnasPrevias)))
  },

  async generarCampoSubcategoria(idCategoria: number, subcategoriaService: SubcategoriaService) {
    const subcategorias = await firstValueFrom(subcategoriaService.getSubCategoriaPorCategoria(idCategoria))
    return (subcategorias || []).map((s) => ({ valor: s.id, texto: s.nombre }))
  },

  generarBloquesFormulario(
    producto: Producto,
    marcas: any[],
    grupos: any[],
    subgrupos: any[],
    tiposProducto: any[],
    cuentas: any[],
    onGrupoChange: (codigo: number) => void,
    onCategoriaChange?: (idCategoria: number) => void,
    subcategoriasFiltradas: any[] = [],
  ) {
    const camposAgrupados: Record<string, string[]> = {
      'Información Básica': [
        'nombreUnico',
        'descripcion',
        'productotipoId',
        'productogrupoCodigo',
        'idSubgrupo',
        'categoriaId',
        'subcategoriaId',
        'marcaId',
        'codbarras1',
        'codigo2',
      ],
      'Información Adicional': [
        'codbarras2',
        'codbarras3',
        'codbarras4',
        'codbarras5',
        'stock',
        'unidadMedidaValor',
        'proteinas',
        'calorias',
        'origen',
        'prodFechaCaducidad',
        'tiempo',
        'descuentoActivo',
        'especificaciones',
      ],
      'Impuestos y Precios': ['pvpa', 'pvpb', 'pvpc', 'pvpd', 'pvpe', 'regimenProd', 'iceporcent', 'ivaporcent'],
      Cuentas: ['tipoCuentaCosto', 'tipoCuenta', 'tipoCuentaVentas'],
    }

    return Object.entries(camposAgrupados).map(([titulo, keys]) => ({
      titulo,
      campos: keys
        .map((key) => {
          let tipo = 'text'
          let opciones: any[] | undefined
          const valor = producto[key as keyof Producto]

          if (key === 'stock') {
            return {
              tipo: 'input-doble',
              label: 'Stock',
              keyIzquierdo: 'existenciaMinima',
              keyDerecho: 'existenciaMaxima',
              valorIzquierdo: producto.existenciaMinima,
              valorDerecho: producto.existenciaMaxima,
              descripcionIzquierdo: 'Mínimo',
              descripcionDerecho: 'Máximo',
              required: false,
            }
          }

          if (key === 'unidadMedidaValor') {
            return {
              tipo: 'input-doble',
              label: 'Unidad de Medida',
              keyIzquierdo: 'unidadMedida',
              keyDerecho: 'valorMedida',
              valorIzquierdo: producto.unidadMedida,
              valorDerecho: producto.valorMedida,
              descripcionIzquierdo: 'ejem. Kg',
              descripcionDerecho: '0.0',
              required: false,
            }
          }

          if (key === 'prodFechaCaducidad') tipo = 'date'

          const opcionesPorKey: Record<string, any[]> = {
            tipoCuenta: cuentas.map((c) => ({ valor: c.nombre, texto: c.nombre })),
            tipoCuentaCosto: cuentas.map((c) => ({ valor: c.nombre, texto: c.nombre })),
            tipoCuentaVentas: cuentas.map((c) => ({ valor: c.nombre, texto: c.nombre })),
            ivaporcent: (opcionesExtras.iva || []).map((i) => ({ valor: `${i.id || i.cod || i.descripcion}`, etiqueta: i.descripcion || `IVA ${i.tarporcent}%` })),
            iceporcent: (opcionesExtras.ice || []).map((i) => ({ valor: String(Number(i.tarporcent)), texto: `${i.cod} - ${i.tarporcent}% - ${i.descripcion}` })),
            regimenProd: (opcionesExtras.regimenes || []).map((r) => ({ valor: r.id, texto: r.tipo || r.nombre })),
            origen: (opcionesExtras.origen || []).map((o) => ({ valor: o.id, texto: o.nombre })),
            productotipoId: tiposProducto.map((t) => ({ valor: t.id, texto: t.nombre })),
            productogrupoCodigo: grupos.map((g) => ({ valor: g.codigo, texto: g.nombre })),
            idSubgrupo: subgrupos.map((s) => ({ valor: s.idSub, texto: s.nombre })),
            categoriaId: (opcionesExtras.categorias || []).map((c) => ({ valor: c.id, texto: c.nombre })),
            subcategoriaId: subcategoriasFiltradas.map((s) => ({ valor: s.id, texto: s.nombre })),
            marcaId: marcas.map((m) => ({ valor: m.id, texto: m.nombre })),
          }

          if (opcionesPorKey[key]) {
            tipo = key === 'ivaporcent' ? 'radio' : 'select'
            opciones = opcionesPorKey[key]
          }

          if (['descuentoActivo', 'especificaciones'].includes(key)) {
            tipo = 'radio'
            opciones = [
              { valor: 1, etiqueta: 'Sí' },
              { valor: 0, etiqueta: 'No' },
            ]
          }

          const campoBase = { key, label: etiquetasCampos[key] || key, tipo, opciones, valor, required: false }

          if (key === 'productogrupoCodigo') {
            return { ...campoBase, onChange: (codigo: number) => !isNaN(codigo) && onGrupoChange(codigo) }
          }

          if (key === 'categoriaId') {
            return { ...campoBase, onChange: (idCategoria: number) => onCategoriaChange?.(idCategoria) }
          }

          if (key === 'subcategoriaId') {
            return { ...campoBase, hidden: subcategoriasFiltradas.length === 0 }
          }

          return campoBase
        })
        .filter(Boolean),
    }))
  },
}

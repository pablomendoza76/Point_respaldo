import { Producto } from '../Interfaces/Productos/producto.model'
import { Observable, forkJoin, of, map, switchMap } from 'rxjs'
import { AdministracionServicios } from '../services/productos_services/productos.service'
import { RegimenService } from '../services/servicios_sin_identificra/regimen.service'
import { ImpuestosService } from '../services/servicios_sin_identificra/Impuestos.service'

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
} = {}

function transformarProducto(producto: any): Producto {
  const camposFecha = ['fechacreacion', 'fechaultactualizacion', 'finpvppromo', 'fechafinpromo', 'prodFechaCaducidad', 'fechaDestacado', 'fechaCompra']
  const result: any = {}

  for (const key in producto) {
    const valor = producto[key]
    if (camposFecha.includes(key)) {
      result[key] = valor && !isNaN(Date.parse(valor)) ? new Date(valor).toISOString() : null
    } else if (typeof valor === 'string' && valor.trim() === '') {
      result[key] = null
    } else if (!isNaN(Number(valor)) && valor !== null && valor !== '') {
      result[key] = Number(valor)
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
  async cargarOpcionesGlobales(adminService: AdministracionServicios, regimenService: RegimenService, impuestosService: ImpuestosService): Promise<void> {
    return new Promise((resolve) => {
      const origen$ = adminService.getOrigen().pipe(
        map((res) => {
          console.log('[ADAPTADOR] Respuesta cruda getOrigen:', res)
          return res
        }),
      )
      const regimenes$ = regimenService.getRegimenes().pipe(
        map((res) => {
          console.log('[ADAPTADOR] Respuesta cruda getRegimenes:', res)
          return res
        }),
      )
      const tiposImpuesto$ = impuestosService.getImpuestos().pipe(
        map((res) => {
          console.log('[ADAPTADOR] Respuesta cruda getImpuestos:', res)
          return res
        }),
      )

      forkJoin({ origen: origen$, regimenes: regimenes$, tipos: tiposImpuesto$ })
        .pipe(
          switchMap(({ origen, regimenes, tipos }) => {
            console.log('[ADAPTADOR] Datos procesados iniciales:', { origen, regimenes, tipos })

            // Debug de los tipos de impuestos
            console.log('[ADAPTADOR][DEBUG] Impuestos recibidos:')
            tipos.forEach((t: any, i: number) => {
              console.log(`  → [${i}] ID: ${t.id}, impuesto: ${t.impuesto}, nombre: ${t.nombre}, descripcion: ${t.descripcion}`)
            })

            const tipoIVA = tipos.find(
              (t: any) => t.impuesto?.toLowerCase().includes('iva') || t.nombre?.toLowerCase().includes('iva') || t.descripcion?.toLowerCase().includes('iva'),
            )

            const tipoICE = tipos.find(
              (t: any) => t.impuesto?.toLowerCase().includes('ice') || t.nombre?.toLowerCase().includes('ice') || t.descripcion?.toLowerCase().includes('ice'),
            )

            console.log('[ADAPTADOR] Tipo IVA encontrado:', tipoIVA)
            console.log('[ADAPTADOR] Tipo ICE encontrado:', tipoICE)
            console.log('[ADAPTADOR] ID usado para IVA:', tipoIVA?.id)
            console.log('[ADAPTADOR] ID usado para ICE:', tipoICE?.id)

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
            })
          }),
        )
        .subscribe({
          next: (res) => {
            opcionesExtras = res
            console.log('[ADAPTADOR] Datos cargados correctamente en opcionesExtras:', opcionesExtras)
            console.log('Origen:', opcionesExtras.origen)
            console.log('Regímenes:', opcionesExtras.regimenes)
            console.log('IVA:', opcionesExtras.iva)
            console.log('ICE:', opcionesExtras.ice)
            resolve()
          },
          error: (error) => {
            console.error('[ADAPTADOR] Error al cargar opciones:', error)
            opcionesExtras = { origen: [], regimenes: [], iva: [], ice: [] }
            resolve()
          },
        })
    })
  },
  desdeApi(
    response: any,
    columnasPrevias: { key: string; selected: boolean }[] = [],
  ): {
    productos: Producto[]
    columnas: { name: string; key: string; selected: boolean }[]
    marcas: string[]
    grupos: string[]
    total: number
  } {
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

    const marcas = Array.from(new Set(productos.map((p) => p.marcaId).filter(Boolean))).map(String)
    const grupos = Array.from(new Set(productos.map((p) => p.productogrupoCodigo).filter(Boolean))).map(String)

    return { productos, columnas, marcas, grupos, total }
  },

  prepararParaCreacion(producto: Producto): Producto {
    return {
      ...producto,
      prodFechaCaducidad: producto.prodFechaCaducidad ? new Date(producto.prodFechaCaducidad).toISOString() : null,
      codigo: 0,
      fechacreacion: new Date().toISOString(),
      fechaultactualizacion: new Date().toISOString(),
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
  ): Observable<{
    productos: Producto[]
    columnas: { name: string; key: string; selected: boolean }[]
    marcas: string[]
    grupos: string[]
    total: number
  }> {
    return servicio.obtenerProductosYColumnas(pagina, limite).pipe(map((respuesta) => this.desdeApi(respuesta, columnasPrevias)))
  },

  generarBloquesFormulario(
    producto: Producto,
    marcas: any[],
    grupos: any[],
    subgrupos: any[],
    tiposProducto: any[],
    cuentas: any[],
    onGrupoChange: (codigo: number) => void,
  ): Array<{ titulo: string; campos: any[] }> {
    const camposAgrupados: Record<string, string[]> = {
      'Información Básica': ['nombreUnico', 'descripcion', 'productotipoId', 'productogrupoCodigo', 'idSubgrupo','marcaId', 'codbarras1', 'codigo2'],
      'Información Adicional': [
        'codbarras2',
        'codbarras3',
        'codbarras4',
        'codbarras5',
        'existenciaMinima',
        'existenciaMaxima',
        'proteinas',
        'calorias',
        'unidadMedida',
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
      campos: keys.map((key) => {
        let tipo = 'text'
        const valor = producto[key as keyof Producto]
        let opciones: any[] | undefined

        // --- Identificación de tipo base ---
        if (typeof valor === 'number') tipo = 'number'
        if (typeof valor === 'string' && !isNaN(Date.parse(valor))) tipo = 'date'
        if (valor instanceof Date) tipo = 'date'

        // --- Ajuste explícito para campo de fecha ---
        if (key === 'prodFechaCaducidad') {
          tipo = 'date'
        }

        // --- Selects de cuentas ---
        if (['tipoCuentaCosto', 'tipoCuenta', 'tipoCuentaVentas'].includes(key)) {
          tipo = 'select'
          opciones = cuentas.map((c) => ({ valor: c.id, texto: c.nombre }))
        }

        // --- IVA como radio usando tarporcent ---
        if (key === 'ivaporcent') {
          tipo = 'radio'
          opciones = (opcionesExtras.iva || [])
            .filter((i) => i && i.tarporcent !== undefined)
            .map((i) => ({
              valor: String(Number(i.tarporcent)),
              etiqueta: i.descripcion || `IVA ${i.tarporcent}%`,
            }))

          if (opciones.length === 0) {
            console.warn('[FORMULARIO] No se generaron opciones para IVA. Datos crudos:', opcionesExtras.iva)
          }
        }

        // --- ICE como select ---
        if (key === 'iceporcent') {
          tipo = 'select'
          opciones =
            opcionesExtras.ice?.map((i) => ({
              valor: String(Number(i.tarporcent)),
              texto: `${i.cod} - ${i.tarporcent}% - ${i.descripcion}`,
            })) ?? []
        }

        // --- Régimen ---
        if (key === 'regimenProd') {
          tipo = 'select'
          opciones =
            opcionesExtras.regimenes?.map((r) => ({
              valor: r.id,
              texto: r.tipo || r.nombre || `Régimen ${r.id}`,
            })) ?? []
        }

        // --- Origen ---
        if (key === 'origen') {
          tipo = 'select'
          opciones =
            opcionesExtras.origen?.map((o) => ({
              valor: o.id,
              texto: o.nombre,
            })) ?? []
        }

        // --- Tipo de producto ---
        if (key === 'productotipoId') {
          tipo = 'select'
          opciones = tiposProducto.map((t) => ({ valor: t.id, texto: t.nombre }))
        }

        // --- Grupo (con evento onChange) ---
        if (key === 'productogrupoCodigo') {
          tipo = 'select'
          opciones = grupos.map((g) => ({ valor: g.codigo, texto: g.nombre }))
          return {
            key,
            label: etiquetasCampos[key] || key,
            tipo,
            opciones,
            valor,
            required: false,
            onChange: (nuevoCodigo: any) => {
              const codigoNumerico = Number(nuevoCodigo)
              if (!isNaN(codigoNumerico)) onGrupoChange(codigoNumerico)
            },
          }
        }

        // --- Subgrupo ---
        if (key === 'idSubgrupo') {
          tipo = 'select'
          opciones = subgrupos.map((s) => ({ valor: s.idSub, texto: s.nombre }))
        }

        // --- Marca ---
        if (key === 'marcaId') {
          tipo = 'select'
          opciones = marcas.map((m) => ({ valor: m.id, texto: m.nombre }))
        }

        // --- Botones Sí/No ---
        if (key === 'descuentoActivo' || key === 'especificaciones') {
          tipo = 'radio'
          opciones = [
            { valor: 1, etiqueta: 'Sí' },
            { valor: 0, etiqueta: 'No' },
          ]
        }

        return {
          key,
          label: etiquetasCampos[key] || key,
          tipo,
          opciones,
          valor,
          required: false,
        }
      }),
    }))
  },
}

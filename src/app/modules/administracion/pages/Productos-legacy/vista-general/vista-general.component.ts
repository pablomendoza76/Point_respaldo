  import { CommonModule } from '@angular/common'
  import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, OnInit } from '@angular/core'
  import { FormsModule } from '@angular/forms'
  import { AdministracionServicios } from '@modules/administracion/services/productos_services/productos.service'
  import { Store, select } from '@ngrx/store'
  import { BarraBusquedaComponent } from '@reusables/barra-busqueda/barra-busqueda.component'
  import { BarraUbicacionComponent } from '@reusables/barra-ubicacion/barra-ubicacion.component'
  import { FormularioDinamicoLoaderComponent } from '@reusables/formulario-dinamico-loader/formulario-dinamico-loader.component'
  import { TablaDinamicaComponent } from '@reusables/tabla-dinamica/tabla-dinamica.component'
  import { setColumnasVisibles, setFiltrosDinamicos, setProductos, setTotalRegistros } from '@stores/tabla_NgRx/tabla.actions'
  import { selectProductos, selectProductosVisibles } from '@stores/tabla_NgRx/tabla.selectors'
  import { AppState } from '@stores/tabla_NgRx/tabla.state'
  import { Observable, forkJoin } from 'rxjs'
  import { take } from 'rxjs/operators'
  import { Producto } from '../../../Interfaces/Productos/producto.model'
  import { adaptarProducto } from '../../../mapping/productos/producto.mapper'
  import { CuentasContablesService } from '../../../services/Cuentas_services/cuentas-contables.service'
  import { CategoriaService } from '../../../services/productos_services/categoria.service'
  import { MarcasService } from '../../../services/productos_services/marcas.service'
  import { SubcategoriaService } from '../../../services/productos_services/subcategoria.service'
  import { SubproductoService } from '../../../services/productos_services/subgrupos.service'
  import { TarifasService } from '../../../services/productos_services/tarifas.service'
  import { TipoProductoService } from '../../../services/productos_services/tipo-producto.service'
  import { ImpuestosService } from '../../../services/servicios_sin_identificra/Impuestos.service'
  import { RegimenService } from '../../../services/servicios_sin_identificra/regimen.service'

  @Component({
    selector: 'app-vista-general',
    standalone: true,
    imports: [CommonModule, FormsModule, BarraUbicacionComponent, BarraBusquedaComponent, TablaDinamicaComponent, FormularioDinamicoLoaderComponent],
    templateUrl: './vista-general.component.html',
    styleUrls: ['./vista-general.component.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  })
  export class VistaGeneralComponent implements OnInit {
    productosVisibles$!: Observable<Producto[]>
    productosFiltrados$!: Observable<Producto[]>
    columnasDisponibles: any[] = []
    columnasSeleccionadas: any[] = []
    filtrosConfiguracion: any[] = []

    formularioVisible = false
    productoSeleccionado: Producto | null = null
    bloquesFormulario: any[] = []
    modoEdicion = true
    mostrandoSpinner: boolean = false

    marcas: any[] = []
    grupos: any[] = []
    subgrupos: any[] = []
    tiposProducto: any[] = []
    cuentas: any[] = []

    paginaActual = 1
    itemsPorPagina = 10
    limiteCargado = 100
    totalRegistros = 0

    opcionesPaginacion = [
      { value: 10, label: '10' },
      { value: 20, label: '20' },
      { value: 50, label: '50' },
      { value: 100, label: '100' },
      { value: 20000, label: 'Todos' },
    ]

    opcionesBusqueda = [
      { value: 'codigo2', label: 'Cod. Común' },
      { value: 'nombreUnico', label: 'Nombre' },
      { value: 'codbarras1', label: 'Cod. de Barras 1' },
      { value: 'codbarras2', label: 'Cod. de Barras 2' },
      { value: 'codbarras3', label: 'Cod. de Barras 3' },
    ]

    constructor(
      private store: Store<AppState>,
      private adminService: AdministracionServicios,
      private marcasService: MarcasService,
      private TarifasService: TarifasService,
      private SubproductoService: SubproductoService,
      private tipoProductoService: TipoProductoService,
      private cuentasContablesService: CuentasContablesService,
      private regimenService: RegimenService,
      private impuestosService: ImpuestosService,
      private cdr: ChangeDetectorRef,
      private categoriaService: CategoriaService,
      private subcategoriaService: SubcategoriaService,
    ) {}

    async ngOnInit(): Promise<void> {
      this.productosVisibles$ = this.store.pipe(select(selectProductos))
      this.productosFiltrados$ = this.store.pipe(select(selectProductosVisibles))
      await adaptarProducto.cargarOpcionesGlobales(this.adminService, this.regimenService, this.impuestosService, this.categoriaService, this.subcategoriaService)

      this.cargarProductos(1, this.limiteCargado)
      this.cargarOpciones()
    }

    cargarProductos(pagina: number, limite: number): void {
      adaptarProducto.obtenerProductosAdaptados(this.adminService, pagina, limite, this.columnasDisponibles).subscribe(({ productos, columnas, total }) => {
        this.store.dispatch(setProductos({ productos }))
        this.store.dispatch(setTotalRegistros({ total }))
        this.totalRegistros = total
        this.limiteCargado = productos.length
        this.columnasDisponibles = columnas
        this.columnasSeleccionadas = columnas.filter((c) => c.selected)
        this.store.dispatch(setColumnasVisibles({ columnasVisibles: this.columnasSeleccionadas }))
      })
    }

    cargarOpciones(): void {
      forkJoin({
        marcas: this.marcasService.getMarcas(),
        grupos: this.TarifasService.getGruposConTarifas(),
        tipos: this.tipoProductoService.getTiposProductos(),
        cuentas: this.cuentasContablesService.getCuentasContables(),
      }).subscribe(({ marcas, grupos, tipos, cuentas }) => {
        this.marcas = marcas
        this.grupos = grupos
        this.tiposProducto = tipos
        this.cuentas = cuentas

        this.filtrosConfiguracion = [
          {
            nombre: 'Grupo',
            key: 'productogrupoCodigo',
            opciones: grupos.map((g) => ({ id: g.codigo, nombre: g.nombre })),
          },
          {
            nombre: 'Marca',
            key: 'marcaId',
            opciones: marcas.map((m) => ({ id: m.id, nombre: m.nombre })),
          },
        ]
      })
    }

    onGuardarProducto(productoActualizado: any): void {
      if (!productoActualizado) return
      console.log('[DEBUG] Datos enviados al guardar:', productoActualizado);
      if (this.modoEdicion) {
        const { codigo, datos } = productoActualizado
        this.adminService.editarProducto(codigo, datos).subscribe(() => {
          this.cargarProductos(this.paginaActual, this.limiteCargado)
          this.onCerrarFormulario()
        })
      } else {
        this.adminService.crearProducto(productoActualizado).subscribe(() => {
          this.cargarProductos(this.paginaActual, this.limiteCargado)
          this.onCerrarFormulario()
        })
      }
    }

    onEditarProducto(productoParcial: Producto): void {
      this.modoEdicion = true

      this.store.pipe(select(selectProductos), take(1)).subscribe((productos) => {
        const productoCompleto = productos.find((p) => p.codigo === productoParcial.codigo)
        if (productoCompleto) {
          this.productoSeleccionado = { ...productoCompleto }
          console.log('[DEBUG][EDITAR FORMULARIO] Producto seleccionado:', this.productoSeleccionado);
          const grupoCodigo = this.productoSeleccionado?.productogrupoCodigo ?? 0

          this.SubproductoService.getSubproductosPorGrupo(grupoCodigo).subscribe((subs) => {
            this.subgrupos = subs

            const categoriaId = (this.productoSeleccionado as any).categoriaId ?? 0
            this.subcategoriaService.getSubCategoriaPorCategoria(categoriaId).subscribe((subcats: any[]) => {
              this.bloquesFormulario = adaptarProducto.generarBloquesFormulario(
                this.productoSeleccionado!,
                this.marcas,
                this.grupos,
                this.subgrupos,
                this.tiposProducto,
                this.cuentas,
                (codigo: number) => this.cargarSubgruposPorGrupo(codigo),
                (idCategoria: number) => this.onCategoriaSeleccionada(idCategoria),
                subcats
              )
              this.formularioVisible = true
              this.cdr.detectChanges()
            })
          })
        }
      })
    }

    onAgregarNuevoProducto(): void {
      const productoVacio: Producto = {} as Producto
      this.modoEdicion = false
      this.productoSeleccionado = productoVacio

      this.bloquesFormulario = adaptarProducto.generarBloquesFormulario(
        productoVacio,
        this.marcas,
        this.grupos,
        this.subgrupos,
        this.tiposProducto,
        this.cuentas,
        (codigo: number) => this.cargarSubgruposPorGrupo(codigo),
        (idCategoria: number) => this.onCategoriaSeleccionada(idCategoria),
        []
      )

      this.formularioVisible = true
    }

    onCategoriaSeleccionada(idCategoria: number): void {
      if (!this.productoSeleccionado) return;
    
      adaptarProducto.generarCampoSubcategoria(idCategoria, this.subcategoriaService).then((subcats) => {
        const bloque = this.bloquesFormulario.find((b) => b.titulo === 'Información Básica');
        if (!bloque) return;
    
        const campo = bloque.campos.find((c: any) => c.key === 'subcategoriaId');
        if (!campo) return;
    
        campo.hidden = subcats.length === 0;
        campo.opciones = [...subcats];
        campo.valor = null;
    
        this.cdr.detectChanges();
      });
    }

    onCerrarFormulario(): void {
      this.formularioVisible = false
      this.productoSeleccionado = null
      this.bloquesFormulario = []
    }

    onFiltrosAplicados(filtros: { [key: string]: string }): void {
      this.store.dispatch(setFiltrosDinamicos({ filtrosDinamicos: filtros }))

      let intento = 0
      const maxIntentos = 10
      const intentarCargarMasProductos = () => {
        this.productosFiltrados$.pipe(take(1)).subscribe((productosFiltrados: Producto[]) => {
          if (productosFiltrados.length > 0 || this.limiteCargado >= this.totalRegistros || intento >= maxIntentos) {
            this.mostrandoSpinner = false
            return
          }
          intento++
          const nuevoLimite = Math.min(this.limiteCargado + 100, this.totalRegistros)
          this.cargarProductos(1, nuevoLimite)
          setTimeout(() => intentarCargarMasProductos(), 100)
        })
      }

      this.mostrandoSpinner = true
      intentarCargarMasProductos()
    }

    onColumnasActualizadas(columnas: any[]): void {
      this.columnasSeleccionadas = columnas.filter((c) => c.selected)
      this.columnasDisponibles = columnas
      this.store.dispatch(setColumnasVisibles({ columnasVisibles: this.columnasSeleccionadas }))
    }

    cargarSubgruposPorGrupo(codigo: number): void {
      if (!codigo) return

      this.SubproductoService.getSubproductosPorGrupo(codigo).subscribe((subs) => {
        this.subgrupos = subs

        if (this.formularioVisible && this.bloquesFormulario.length > 0) {
          const bloque = this.bloquesFormulario.find((b) => b.titulo === 'Información Básica')
          if (bloque) {
            const campoSubgrupo = bloque.campos.find((c: any) => c.key === 'idSubgrupo')
            if (campoSubgrupo) {
              campoSubgrupo.opciones = subs.map((s: any) => ({
                valor: s.idSub,
                texto: s.nombre,
              }))
              if (this.productoSeleccionado?.idSubgrupo) {
                campoSubgrupo.valor = this.productoSeleccionado.idSubgrupo
              }
              this.cdr.detectChanges()
            }
          }
        }
      })
    }

    onCambioPagina(pagina: number): void {
      const requerido = pagina * this.itemsPorPagina
      if (requerido > this.limiteCargado && requerido <= this.totalRegistros) {
        this.cargarProductos(1, requerido)
      }
      this.paginaActual = pagina
    }

    onCambioItemsPorPagina(cantidad: number): void {
      this.itemsPorPagina = cantidad
      this.paginaActual = 1
      this.onCerrarFormulario()
      if (cantidad > this.limiteCargado) {
        this.cargarProductos(1, cantidad)
      }
    }

    onEliminarRegistro(productoParcial: Producto): void {
      this.store.pipe(select(selectProductos), take(1)).subscribe((productos) => {
        const productoCompleto = productos.find((p) => p.codigo === productoParcial.codigo);
        if (!productoCompleto) return;
    
        this.adminService.cambiarEstadoProducto(productoCompleto.codigo).subscribe(() => {
          this.cargarProductos(this.paginaActual, this.limiteCargado);
        });
      });
    }
    
    
  }

import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, forkJoin } from 'rxjs';
import { AppState } from '../../../state/tabla_NgRx/tabla.state';
import {
  setProductos,
  setColumnasVisibles,
  setFiltrosDinamicos,
  setTotalRegistros
} from '../../../state/tabla_NgRx/tabla.actions';
import { selectProductos  } from '../../../state/tabla_NgRx/tabla.selectors';
import { BarraUbicacionComponent } from '../../../componentes_reutilizables/barra-ubicacion/barra-ubicacion.component';
import { BarraBusquedaComponent } from '../../../componentes_reutilizables/barra-busqueda/barra-busqueda.component';
import { TablaDinamicaComponent } from '../../../componentes_reutilizables/tabla-dinamica/tabla-dinamica.component';
import { FormularioDinamicoLoaderComponent } from '../../../componentes_reutilizables/formulario-dinamico-loader/formulario-dinamico-loader.component';
import { AdministracionServicios } from '../../../services/productos_services/productos.service';
import { MarcasService } from '../../../services/productos_services/marcas.service';
import { TarifasService } from '../../../services/productos_services/tarifas.service';
import { SubproductoService } from '../../../services/productos_services/subgrupos.service';
import { TipoProductoService } from '../../../services/productos_services/tipo-producto.service';

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

@Component({
  selector: 'app-vista-general',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BarraUbicacionComponent,
    BarraBusquedaComponent,
    TablaDinamicaComponent,
    FormularioDinamicoLoaderComponent
  ],
  templateUrl: './vista-general.component.html',
  styleUrls: ['./vista-general.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VistaGeneralComponent implements OnInit {
  productosVisibles$: Observable<any[]>;
  columnasDisponibles: any[] = [];
  columnasSeleccionadas: any[] = [];
  filtrosConfiguracion: any[] = [];

  formularioVisible = false;
  productoSeleccionado: any = null;
  modoEdicion = true;
  bloquesFormulario: Array<{ titulo: string; campos: any[] }> = [];

  paginaActual = 1;
  itemsPorPagina = 10;
  limiteCargado = 100;
  totalRegistros = 0;

  opcionesPaginacion = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 20000, label: 'Todos' }
  ];

  opcionesBusqueda = [
    { value: 'codigo', label: 'Cod. Común' },
    { value: 'nombreUnico', label: 'Nombre' },
    { value: 'codbarras1', label: 'Cod. de Barras 1' },
    { value: 'codbarras2', label: 'Cod. de Barras 2' },
    { value: 'codbarras3', label: 'Cod. de Barras 3' }
  ];

  marcas: any[] = [];
  grupos: any[] = [];
  subgrupos: any[] = [];
  tiposProducto: any[] = [];

  constructor(
    private store: Store<AppState>,
    private adminService: AdministracionServicios,
    private marcasService: MarcasService,
    private TarifasService: TarifasService,
    private SubproductoService: SubproductoService,
    private tipoProductoService: TipoProductoService
  ) {
    this.productosVisibles$ = this.store.pipe(select(selectProductos ));
  }

  /**
   * Inicializa la vista cargando productos y catálogos base.
   */
  ngOnInit(): void {
    this.cargarProductos(1, this.limiteCargado);
    this.cargarOpciones();
  }

  /**
   * Carga productos y columnas desde el backend.
   */
  cargarProductos(pagina: number, limite: number): void {
    this.adminService.obtenerProductosYColumnas(pagina, limite).subscribe(({ productos, columnas, total }) => {
      this.store.dispatch(setProductos({ productos }));
      this.store.dispatch(setTotalRegistros({ total }));
      this.totalRegistros = total;
      this.limiteCargado = productos.length;

      this.columnasDisponibles = columnas;
      this.columnasSeleccionadas = columnas.filter(col => col.selected);
      this.store.dispatch(setColumnasVisibles({ columnasVisibles: this.columnasSeleccionadas }));
    });
  }

  /**
   * Carga marcas, grupos, tipos y configura los filtros dinámicos.
   */
  cargarOpciones(): void {
    forkJoin({
      marcas: this.marcasService.getMarcas(),
      grupos: this.TarifasService.getGruposConTarifas(),
      tipos: this.tipoProductoService.getTiposProductos()
    }).subscribe(({ marcas, grupos, tipos }) => {
      this.marcas = marcas || [];
      this.grupos = grupos || [];
      this.tiposProducto = Array.isArray(tipos) ? tipos : [];

      this.filtrosConfiguracion = [
        {
          nombre: 'Grupo',
          key: 'productogrupoCodigo',
          opciones: this.grupos.map(g => ({ id: g.codigo, nombre: g.nombre }))
        },
        {
          nombre: 'Marca',
          key: 'marcaId',
          opciones: this.marcas.map(m => ({ id: m.id, nombre: m.nombre }))
        }
      ];
    });
  }

  /**
   * Aplica filtros desde la barra de búsqueda.
   */
  onFiltrosAplicados(filtros: { [key: string]: string }): void {
    this.store.dispatch(setFiltrosDinamicos({ filtrosDinamicos: filtros }));
  }

  /**
   * Actualiza columnas visibles seleccionadas por el usuario.
   */
  onColumnasActualizadas(columnas: { name: string; key: string; selected: boolean }[]): void {
    this.columnasDisponibles = this.columnasDisponibles.map(col => {
      const actualizada = columnas.find(c => c.key === col.key);
      return actualizada ? { ...col, selected: actualizada.selected } : col;
    });

    this.columnasSeleccionadas = this.columnasDisponibles.filter(col => col.selected);
    this.store.dispatch(setColumnasVisibles({ columnasVisibles: this.columnasSeleccionadas }));
  }

  /**
   * Abre el formulario en modo edición para el producto seleccionado.
   */
  onEditarProducto(productoParcial: any): void {
    this.modoEdicion = true;
  
    // Buscamos el producto completo usando el código
    this.store.pipe(select(selectProductos)).subscribe(productos => {
      const productoCompleto = productos.find(p => p.codigo === productoParcial.codigo);
  
      if (productoCompleto) {
        this.productoSeleccionado = { ...productoCompleto };
        this.cargarSubgruposPorGrupo(this.productoSeleccionado.productogrupoCodigo);
        this.bloquesFormulario = this.generarTodosLosCamposComoBloque(this.productoSeleccionado);
        this.formularioVisible = true;
      } else {
        console.warn('Producto completo no encontrado en el store.');
      }
    }).unsubscribe(); // Nos desuscribimos de inmediato para evitar memoria extra
  }
  

  /**
   * Abre el formulario en modo creación con un producto vacío.
   */
  onAgregarNuevoProducto(): void {
    const productoVacio: any = {};
    Object.keys(etiquetasCampos).forEach(clave => {
      productoVacio[clave] = null;
    });

    this.modoEdicion = false;
    this.productoSeleccionado = productoVacio;
    this.bloquesFormulario = this.generarTodosLosCamposComoBloque(productoVacio);
    this.formularioVisible = true;
  }

  /**
 * Carga los subgrupos desde el backend según el código del grupo.
 */
  cargarSubgruposPorGrupo(codigo: number): void {
    if (!codigo) return;
    this.SubproductoService.getSubproductosPorGrupo(codigo).subscribe(subs => {
      this.subgrupos = subs;
  
      // Actualiza solo las opciones del campo idSubgrupo sin regenerar todo el formulario
      const bloque = this.bloquesFormulario.find(b => b.titulo === 'Información Básica');
      if (bloque) {
        const campoSubgrupo = bloque.campos.find(c => c.key === 'idSubgrupo');
        if (campoSubgrupo) {
          campoSubgrupo.opciones = this.subgrupos.map(s => ({ valor: s.idSub, texto: s.nombre }));
        }
      }
    });
  }
  


  /**
   * Guarda un producto en modo creación o edición.
   */
  onGuardarProducto(productoActualizado: any): void {
    if (!productoActualizado) return;

    if (this.modoEdicion) {
      const { codigo, datos } = productoActualizado;
      this.adminService.editarProducto(codigo, datos).subscribe({
        next: () => {
          this.cargarProductos(this.paginaActual, this.limiteCargado);
          this.formularioVisible = false;
        },
        error: (err) => console.error('Error al actualizar el producto:', err)
      });
    } else {
      this.adminService.crearProducto(productoActualizado).subscribe({
        next: () => {
          this.cargarProductos(this.paginaActual, this.limiteCargado);
          this.formularioVisible = false;
        },
        error: (err) => console.error('Error al crear el producto:', err)
      });
    }
  }

  /**
   * Cierra el formulario de creación/edición.
   */
  onCerrarFormulario(): void {
    this.formularioVisible = false;
    this.productoSeleccionado = null;
    this.bloquesFormulario = [];
  }

  /**
 * Crea bloques de formulario con inputs dinámicos y opciones.
 */
generarTodosLosCamposComoBloque(producto: any): Array<{ titulo: string; campos: any[] }> {
  const bloques: Array<{ titulo: string; campos: any[] }> = [];

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

  for (const [titulo, keys] of Object.entries(camposAgrupados)) {
    const campos = keys.map(key => {
      let tipo = this.detectarTipo(producto[key]);
      let opciones: any[] | undefined;

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
        opciones = this.tiposProducto.map(t => ({ valor: t.id, texto: t.nombre }));
      }

      if (key === 'productogrupoCodigo') {
        tipo = 'select';
        opciones = this.grupos.map(g => ({ valor: g.codigo, texto: g.nombre }));

        return {
          key,
          label: this.obtenerEtiqueta(key),
          tipo,
          opciones,
          required: false,
          onChange: (nuevoCodigo: any) => {
            const codigoNumerico = Number(nuevoCodigo);
            if (!isNaN(codigoNumerico)) {
              this.productoSeleccionado.productogrupoCodigo = codigoNumerico;
              this.cargarSubgruposPorGrupo(codigoNumerico);
            }
          }
        };
      }

      if (key === 'idSubgrupo') {
        tipo = 'select';
        opciones = this.subgrupos.map(s => ({ valor: s.idSub, texto: s.nombre }));
      }

      if (key === 'marcaId') {
        tipo = 'select';
        opciones = this.marcas.map(m => ({ valor: m.id, texto: m.nombre }));
      }

      return {
        key,
        label: this.obtenerEtiqueta(key),
        tipo,
        opciones,
        required: false
      };
    });

    bloques.push({ titulo, campos });
  }

  return bloques;
}


  /**
   * Devuelve la etiqueta personalizada para el campo o la capitaliza.
   */
  private obtenerEtiqueta(key: string): string {
    return etiquetasCampos[key] || this.capitalizar(key);
  }

  /**
   * Capitaliza un texto separando camelCase y guiones bajos.
   */
  private capitalizar(texto: string): string {
    return texto
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Detecta el tipo de input según el valor recibido.
   */
  private detectarTipo(valor: any): string {
    if (valor instanceof Date) return 'date';
    if (typeof valor === 'number') return 'number';
    return 'text';
  }

  /**
 * Maneja el cambio de página en la tabla.
 * Si se requiere más productos que los cargados, solicita nuevos desde el backend.
 */
onCambioPagina(pagina: number): void {
  const requeridoHasta = pagina * this.itemsPorPagina;
  if (requeridoHasta > this.limiteCargado && requeridoHasta <= this.totalRegistros) {
    this.cargarProductos(1, requeridoHasta);
  }
  this.paginaActual = pagina;
}

/**
 * Maneja el cambio de ítems por página en la paginación.
 * Recarga los datos si se requiere más de lo ya cargado.
 */
onCambioItemsPorPagina(cantidad: number): void {
  this.itemsPorPagina = cantidad;
  this.paginaActual = 1;
  this.formularioVisible = false;
  this.productoSeleccionado = null;
  this.bloquesFormulario = [];

  if (cantidad > this.limiteCargado) {
    this.cargarProductos(1, cantidad);
  }
}

}

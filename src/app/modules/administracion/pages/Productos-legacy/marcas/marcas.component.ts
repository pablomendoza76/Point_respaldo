import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarcasService } from '@modules/administracion/services/productos_services/marcas.service';
import { Store, select } from '@ngrx/store';
import { BarraBusquedaComponent } from '@reusables/barra-busqueda/barra-busqueda.component';
import { BarraUbicacionComponent } from '@reusables/barra-ubicacion/barra-ubicacion.component';
import { FormularioDinamicoLoaderComponent } from '@reusables/formulario-dinamico-loader/formulario-dinamico-loader.component';
import { TablaDinamicaComponent } from '@reusables/tabla-dinamica/tabla-dinamica.component';
import { setColumnasVisibles, setProductos, setTotalRegistros } from '@stores/tabla_NgRx/tabla.actions';
import { selectProductos } from '@stores/tabla_NgRx/tabla.selectors';
import { AppState } from '@stores/tabla_NgRx/tabla.state';
import { Observable } from 'rxjs';
import { adaptarMarca } from '../../../mapping/productos/maracs.mapper'; // Asegúrate de importar correctamente

/**
 * Componente que gestiona la vista de marcas.
 * Permite listar, crear y editar marcas utilizando un formulario dinámico y una tabla con paginación.
 */
@Component({
  selector: 'app-vista-marcas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BarraUbicacionComponent,
    BarraBusquedaComponent,
    TablaDinamicaComponent,
    FormularioDinamicoLoaderComponent
  ],
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MarcasComponent implements OnInit {
  columnasVisibles$!: Observable<any[]>;
  registrosVisibles$!: Observable<any[]>;

  marcaSeleccionada: any = null;
  formularioVisible = false;
  modoEdicion = true;
  bloquesFormulario: any[] = [];

  paginaActual = 1;
  itemsPorPagina = 10;
  totalRegistros = 0;

  opcionesPaginacion = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 20000, label: 'Todos' },
  ];

  constructor(
    private marcaService: MarcasService,
    private store: Store<AppState>
  ) {
    this.registrosVisibles$ = this.store.pipe(select(selectProductos));
  }

  ngOnInit(): void {
    this.cargarMarcas();
  }

  /**
   * Usa el adaptador para obtener marcas y configurar el estado global.
   */
  cargarMarcas(): void {
    adaptarMarca.obtenerMarcasAdaptadas(this.marcaService).subscribe(({ marcas, columnas, total }) => {
      this.store.dispatch(setProductos({ productos: marcas }));
      this.store.dispatch(setColumnasVisibles({ columnasVisibles: columnas }));
      this.store.dispatch(setTotalRegistros({ total }));
      this.totalRegistros = total;
    });
  }

  /**
   * Abre el formulario para crear una nueva marca.
   */
  onAgregarNuevaMarca(): void {
    this.modoEdicion = false;
    this.marcaSeleccionada = { nombre: '', descripcion: '' };
    this.bloquesFormulario = this.generarBloquesFormulario('Nueva Marca');
    this.formularioVisible = true;
  }

  /**
   * Abre el formulario para editar una marca existente.
   * @param marca Marca a editar
   */
  onEditarMarca(marca: any): void {
    this.modoEdicion = true;
    this.marcaSeleccionada = { ...marca };
    this.bloquesFormulario = this.generarBloquesFormulario('Editar Marca');
    this.formularioVisible = true;
  }

  /**
   * Guarda o actualiza la marca utilizando el adaptador.
   * @param data Datos desde el formulario
   */
  onGuardarMarca(data: any): void {
    if (this.modoEdicion && this.marcaSeleccionada?.id) {
      adaptarMarca.editarMarca(this.marcaService, this.marcaSeleccionada.id, data).subscribe(() => {
        this.cargarMarcas();
        this.onCerrarFormulario();
      });
    } else {
      adaptarMarca.crearMarca(this.marcaService, data).subscribe(() => {
        this.cargarMarcas();
        this.onCerrarFormulario();
      });
    }
  }

  /**
   * Cierra y limpia el formulario.
   */
  onCerrarFormulario(): void {
    this.formularioVisible = false;
    this.marcaSeleccionada = null;
    this.bloquesFormulario = [];
  }

  /**
   * Genera los bloques del formulario.
   */
  generarBloquesFormulario(titulo: string): any[] {
    return [
      {
        titulo,
        campos: [
          { key: 'nombre', label: 'Nombre', tipo: 'text', required: true },
          { key: 'descripcion', label: 'Descripción', tipo: 'text', required: false },
        ],
      },
    ];
  }

  onCambioPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  onCambioItemsPorPagina(cantidad: number): void {
    this.itemsPorPagina = cantidad;
    this.paginaActual = 1;
  }
}

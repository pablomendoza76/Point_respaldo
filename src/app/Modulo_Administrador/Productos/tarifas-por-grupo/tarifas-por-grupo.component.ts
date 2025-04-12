import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { TarifasService } from '../../../services/productos_services/tarifas.service';
import { MenuRoutesService } from '../../../services/servicios_compartidos/menu-routes.service';
import { BarraUbicacionComponent } from '../../../componentes_reutilizables/barra-ubicacion/barra-ubicacion.component';
import { BarraBusquedaComponent } from '../../../componentes_reutilizables/barra-busqueda/barra-busqueda.component';
import { FormularioDinamicoLoaderComponent } from '../../../componentes_reutilizables/formulario-dinamico-loader/formulario-dinamico-loader.component';
import { DeleteModalComponent } from '../../../componentes_reutilizables/delete-modal/delete-modal.component';

@Component({
  selector: 'app-tarifas-por-grupo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BarraUbicacionComponent,
    BarraBusquedaComponent,
    FormularioDinamicoLoaderComponent,
    DeleteModalComponent
  ],
  templateUrl: './tarifas-por-grupo.component.html',
  styleUrls: ['./tarifas-por-grupo.component.scss']
})
export class TarifasPorGrupoComponent implements OnInit, OnDestroy {
  gruposOriginales: any[] = [];
  grupos: any[] = [];
  grupoSeleccionado: any = null;

  mostrarFormularioEdicion = false;
  esEdicion = true;

  registroAEliminar: any = null;
  mostrarModalEliminar = false;

  bloquesFormulario: Array<{ titulo: string; campos: any[] }> = [];

  searchValue = '';
  sinResultados = false;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private tarifasService: TarifasService,
    private router: Router,
    private menuRoutesService: MenuRoutesService
  ) {}

  ngOnInit(): void {
    this.obtenerGruposDesdeApi();

    this.searchSubject
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => this.filtrarGrupos());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  obtenerGruposDesdeApi(): void {
    this.tarifasService.getGruposConTarifas().subscribe((data) => {
      this.gruposOriginales = data || [];
      this.filtrarGrupos();
    });
  }

  filtrarGrupos(): void {
    const valor = this.searchValue.trim().toLowerCase();
    this.grupos = valor
      ? this.gruposOriginales.filter(grupo =>
          grupo.nombre?.toLowerCase().includes(valor)
        )
      : [...this.gruposOriginales];

    this.sinResultados = this.grupos.length === 0;
    if (this.sinResultados) this.grupoSeleccionado = null;
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchValue);
  }

  seleccionarGrupo(grupo: any): void {
    this.grupoSeleccionado = grupo;
  }

  agregarGrupo(): void {
    this.esEdicion = false;
    this.grupoSeleccionado = {
      codigo: null,
      nombre: '',
      descripcion: '',
      garantia: 0,
      orden: 0,
      vistaWeb: false,
      vistaSistema: false,
      parent: false,
      estado: 'Activo',
      tarifas: [
        { tipo: 'P.V.P A', utilidad: 0, descuento: 0 },
        { tipo: 'P.V.P B', utilidad: 0, descuento: 0 },
        { tipo: 'P.V.P C', utilidad: 0, descuento: 0 }
      ]
    };
    this.bloquesFormulario = this.generarBloquesFormulario(this.grupoSeleccionado);
    this.mostrarFormularioEdicion = true;
  }

  editarGrupo(grupo: any): void {
    this.esEdicion = true;
    this.grupoSeleccionado = {
      ...grupo,
      tarifas: grupo.tarifas ?? [
        { tipo: 'P.V.P A', utilidad: 0, descuento: 0 },
        { tipo: 'P.V.P B', utilidad: 0, descuento: 0 },
        { tipo: 'P.V.P C', utilidad: 0, descuento: 0 }
      ]
    };
    this.bloquesFormulario = this.generarBloquesFormulario(this.grupoSeleccionado);
    this.mostrarFormularioEdicion = true;
  }
  
  guardarGrupo(): void {
    const { codigo, ...datos } = this.grupoSeleccionado;
    const peticion = this.esEdicion
      ? this.tarifasService.actualizarGrupo({ ...datos, codigo })
      : this.tarifasService.agregarGrupo(datos);

    peticion.subscribe(() => {
      this.obtenerGruposDesdeApi();
      this.mostrarFormularioEdicion = false;
    });
  }

  cancelarEdicion(): void {
    this.mostrarFormularioEdicion = false;
    this.grupoSeleccionado = null;
    this.bloquesFormulario = [];
  }

  abrirModalEliminar(grupo: any): void {
    event?.stopPropagation(); // Para evitar que el click en el botón seleccione el grupo
    this.registroAEliminar = grupo;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.registroAEliminar = null;
  }

  eliminarGrupo(): void {
    if (this.registroAEliminar?.codigo) {
      this.tarifasService.eliminarGrupo(this.registroAEliminar.codigo).subscribe(() => {
        this.obtenerGruposDesdeApi();
        this.cerrarModalEliminar();
      });
    }
  }

  cambiarEstado(): void {
    if (this.grupoSeleccionado) {
      this.grupoSeleccionado.estado =
        this.grupoSeleccionado.estado === 'Activo' ? 'Inactivo' : 'Activo';
    }
  }

  generarBloquesFormulario(grupo: any): Array<{ titulo: string; campos: any[] }> {
    return [
      {
        titulo: 'Información General',
        campos: [
          { key: 'nombre', label: 'Nombre del Grupo', tipo: 'text', required: true },
          { key: 'descripcion', label: 'Descripción', tipo: 'text' },
          { key: 'garantia', label: 'Garantía (meses)', tipo: 'number' },
          { key: 'orden', label: 'Orden', tipo: 'number' },
          {
            key: 'vistaWeb',
            label: 'Vista Web',
            tipo: 'select',
            opciones: [
              { valor: true, texto: 'Sí' },
              { valor: false, texto: 'No' }
            ]
          },
          {
            key: 'vistaSistema',
            label: 'Vista Sistema',
            tipo: 'select',
            opciones: [
              { valor: true, texto: 'Sí' },
              { valor: false, texto: 'No' }
            ]
          },
          {
            key: 'parent',
            label: 'Parent',
            tipo: 'select',
            opciones: [
              { valor: true, texto: 'Sí' },
              { valor: false, texto: 'No' }
            ]
          },
          {
            key: 'estado',
            label: 'Estado',
            tipo: 'select',
            opciones: [
              { valor: 'Activo', texto: 'Activo' },
              { valor: 'Inactivo', texto: 'Inactivo' }
            ]
          }
        ]
      },
      {
        titulo: 'Configuración de Precios',
        campos: grupo.tarifas.map((tarifa: any, index: number) => ({
          key: `tarifas[${index}]`,
          tipo: 'grupo',
          campos: [
            { key: `tarifas[${index}].tipo`, label: `Tipo`, tipo: 'text', disabled: true },
            { key: `tarifas[${index}].utilidad`, label: `Utilidad`, tipo: 'number' },
            { key: `tarifas[${index}].descuento`, label: `Descuento`, tipo: 'number' }
          ]
        }))
      }
    ];
  }

  confirmarEliminacion(): void {
    if (this.registroAEliminar?.codigo) {
      this.tarifasService.eliminarGrupo(this.registroAEliminar.codigo).subscribe(() => {
        this.obtenerGruposDesdeApi();
        this.cerrarModalEliminar();
      });
    }
  }

  cancelarEliminacion(): void {
    this.mostrarModalEliminar = false;
    this.registroAEliminar = null;
  }
}

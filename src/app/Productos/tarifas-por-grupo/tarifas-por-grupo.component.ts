import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TarifasService } from '../../services/productos_services/tarifas.service';
import { MenuRoutesService } from '../../services/servicios_compartidos/menu-routes.service'; // Importar el servicio
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tarifas-por-grupo',
  standalone: true,
  templateUrl: './tarifas-por-grupo.component.html',
  styleUrls: ['./tarifas-por-grupo.component.css'],
  imports: [CommonModule, RouterModule, FormsModule],
})
export class TarifasPorGrupoComponent implements OnInit, OnDestroy {
  grupos: any[] = [];
  grupoSeleccionado: any = null;
  searchValue: string = '';
  mostrarFormularioEdicion: boolean = false;
  mostrarModalEliminar: boolean = false;
  esEdicion: boolean = false;
  isAdminMenuCollapsed: boolean = false;
  codigoGrupoAEliminar: number | null = null;

  // Subject para manejar el debouncing
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Rutas del menú
  menuRoutes: { [key: string]: string } = {};

  constructor(
    private tarifasService: TarifasService,
    private router: Router,
    private menuRoutesService: MenuRoutesService // Inyectar el servicio
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
    this.menuRoutes = this.menuRoutesService.getMenuRoutes(); // Obtener rutas del menú

    // Configurar el debounce para la búsqueda
    this.searchSubject
      .pipe(
        debounceTime(1000), // Espera 1 segundo después de que el usuario deja de escribir
        takeUntil(this.destroy$) // Limpia la suscripción cuando el componente se destruye
      )
      .subscribe(() => {
        this.cargarDatos();
      });
  }

  ngOnDestroy(): void {
    // Limpiar las suscripciones cuando el componente se destruye
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarDatos(): void {
    const grupos = this.tarifasService.getGrupos();

    if (this.searchValue) {
      // Filtra los grupos que coincidan con el valor de búsqueda
      this.grupos = grupos.filter((grupo) =>
        grupo.nombre.toLowerCase().includes(this.searchValue.toLowerCase())
      );
    } else {
      // Si no hay valor de búsqueda, muestra todos los grupos
      this.grupos = grupos;
    }
  }

  onSearchChange(): void {
    // Emite el valor de búsqueda al Subject para aplicar el debounce
    this.searchSubject.next(this.searchValue);
  }

  seleccionarGrupo(grupo: any): void {
    this.grupoSeleccionado = grupo;
    this.searchValue = ''; // Resetea el valor de búsqueda
    this.cargarDatos(); // Vuelve a cargar todos los grupos
  }

  agregarGrupo(): void {
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
        { tipo: 'P.V.P A', utilidad: 1, descuento: 1 },
        { tipo: 'P.V.P B', utilidad: 1, descuento: 1 },
        { tipo: 'P.V.P C', utilidad: 1, descuento: 1 },
      ],
    };
    this.esEdicion = false;
    this.mostrarFormularioEdicion = true;
  }

  editarGrupo(grupo: any): void {
    this.grupoSeleccionado = { ...grupo };
    this.esEdicion = true;
    this.mostrarFormularioEdicion = true;
  }

  guardarGrupo(): void {
    if (this.esEdicion) {
      this.tarifasService.actualizarGrupo(this.grupoSeleccionado);
    } else {
      this.tarifasService.agregarGrupo(this.grupoSeleccionado);
    }
    this.cargarDatos();
    this.mostrarFormularioEdicion = false;
  }

  cancelarEdicion(): void {
    this.mostrarFormularioEdicion = false;
    this.grupoSeleccionado = null;
  }

  abrirModalEliminar(codigo: number): void {
    this.codigoGrupoAEliminar = codigo;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.codigoGrupoAEliminar = null;
  }

  eliminarGrupo(): void {
    if (this.codigoGrupoAEliminar !== null) {
      this.tarifasService.eliminarGrupo(this.codigoGrupoAEliminar);
      this.cargarDatos();
      this.cerrarModalEliminar();
    }
  }

  cambiarEstado(): void {
    if (this.grupoSeleccionado) {
      this.grupoSeleccionado.estado = this.grupoSeleccionado.estado === 'Activo' ? 'Inactivo' : 'Activo';
    }
  }

  toggleAdminMenu(): void {
    this.isAdminMenuCollapsed = !this.isAdminMenuCollapsed;
  }

  navigateTo(option: string): void {
    const ruta = this.menuRoutes[option];
    if (ruta) {
      this.router.navigate([ruta]);
    }
  }

  // Método para verificar si la opción está activa
  isActive(option: string): boolean {
    const ruta = this.menuRoutes[option];
    return ruta ? this.router.url.includes(ruta) : false;
  }
}
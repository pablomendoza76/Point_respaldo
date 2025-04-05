import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TarifasService } from '../../../services/productos_services/tarifas.service';
import { MenuRoutesService } from '../../../services/servicios_compartidos/menu-routes.service'; // Importar el servicio
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tarifas-por-grupo',
  standalone: true,
  templateUrl: './tarifas-por-grupo.component.html',
  styleUrls: ['./tarifas-por-grupo.component.scss'],
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
    this.menuRoutes = this.menuRoutesService.getMenuRoutes(); // Obtener rutas del menú

    // Configurar el debounce para la búsqueda
    this.searchSubject
      .pipe(
        debounceTime(1000), // Espera 1 segundo después de que el usuario deja de escribir
        takeUntil(this.destroy$) // Limpia la suscripción cuando el componente se destruye
      )
      .subscribe(() => {
      }); 
  }

  ngOnDestroy(): void {
    // Limpiar las suscripciones cuando el componente se destruye
    this.destroy$.next();
    this.destroy$.complete();
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

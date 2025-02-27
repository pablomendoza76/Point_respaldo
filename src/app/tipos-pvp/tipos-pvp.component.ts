import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PVPService } from '../services/tipos-pvp_services/PVP.service';

@Component({
  selector: 'app-tipos-pvp',
  standalone: true,
  templateUrl: './tipos-pvp.component.html',
  styleUrls: ['./tipos-pvp.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class TiposPVPComponent implements OnInit {
  // Variables de la aplicación
  tiposPVP: any[] = [];
  tiposPVPFiltrados: any[] = [];
  searchValue: string = '';
  Math = Math;

  // Variables para la edición y eliminación de tipos de PVP
  mostrarFormularioEdicion: boolean = false;
  mostrarModalEliminar: boolean = false;
  tipoPVPSeleccionado: any = null;
  tipoPVPAEliminar: any | null = null;
  esEdicion: boolean = false;

  // Variables para la paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  totalRegistros: number = 0;

  // Variables para el menú de administración
  isAdminMenuCollapsed: boolean = false;

  // Diccionario de opciones con sus respectivas rutas
  menuRoutes: { [key: string]: string } = {
    'Administración': 'administrador',
    'Proveedores': 'proveedores',
    'Tipos PVP': 'tipos-pvp',
    'Clientes': 'clientes',
    'Cuentas Contables': 'cuentas-contables',
    'Empresa': 'empresa',
    'Configuración': 'configuracion',
    'Productos': 'productos',
    'Vista General': 'vista-general',
    'Marcas': 'marcas',
    'Tipos de Productos': 'tipos-productos',
    'Tarifas por Grupo': 'tarifas-por-grupo',
  };

  constructor(private router: Router, private pvpService: PVPService) {}

  ngOnInit(): void {
    this.cargarTiposPVP();
  }

  // Método para cargar los tipos de PVP desde el servicio
  cargarTiposPVP(): void {
    this.tiposPVP = this.pvpService.getTiposPVP();
    this.actualizarListaTiposPVP();
  }

  actualizarListaTiposPVP(): void {
    this.tiposPVPFiltrados = this.tiposPVP.filter(
      (tipo) =>
        tipo.tipoPrecio.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        tipo.descripcion.toLowerCase().includes(this.searchValue.toLowerCase())
    );
    this.totalRegistros = this.tiposPVPFiltrados.length;
  }

  agregarTipoPVP(): void {
    this.tipoPVPSeleccionado = {
      tipoPrecio: '',
      descripcion: '',
      alias: '',
      estado: 'Activo',
    };
    this.esEdicion = false;
    this.mostrarFormularioEdicion = true;
  }

  editarTipoPVP(tipo: any): void {
    this.tipoPVPSeleccionado = { ...tipo };
    this.esEdicion = true;
    this.mostrarFormularioEdicion = true;
  }

  guardarTipoPVP(): void {
    if (this.esEdicion) {
      this.tiposPVP = this.pvpService.actualizarTipoPVP(this.tipoPVPSeleccionado);
    } else {
      this.tiposPVP = this.pvpService.agregarTipoPVP(this.tipoPVPSeleccionado);
    }
    this.actualizarListaTiposPVP();
    this.mostrarFormularioEdicion = false;
  }

  cancelarEdicion(): void {
    this.mostrarFormularioEdicion = false;
    this.tipoPVPSeleccionado = null;
  }

  abrirModalEliminar(tipo: any): void {
    this.tipoPVPAEliminar = tipo;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.tipoPVPAEliminar = null;
  }

  eliminarTipoPVP(): void {
    if (this.tipoPVPAEliminar) {
      this.tiposPVP = this.pvpService.eliminarTipoPVP(this.tipoPVPAEliminar.tipoPrecio);
      this.actualizarListaTiposPVP();
      this.cerrarModalEliminar();
    }
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= Math.ceil(this.totalRegistros / this.itemsPorPagina)) {
      this.paginaActual = pagina;
    }
  }

  // Método para navegar a diferentes rutas
  navigateTo(option: string): void {
    const ruta = this.menuRoutes[option];
    if (ruta) {
      this.router.navigate([`/${ruta}`]);
    }
  }

  // Método para alternar el menú de administración
  toggleAdminMenu(): void {
    this.isAdminMenuCollapsed = !this.isAdminMenuCollapsed;
  }

  //metodo para saber donde estamos en el segundo menú
  // Método para verificar si la opción está activa
  isActive(option: string): boolean {
    return this.router.url.includes(option);
  }
}
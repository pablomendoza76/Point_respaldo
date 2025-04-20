import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MenuRoutesService } from '../../../services/servicios_compartidos/menu-routes.service'; // Importar el servicio
import { PVPService } from '../../../services/tipos-pvp_services/PVP.service';

@Component({
  selector: 'app-tipos-pvp',
  standalone: true,
  templateUrl: './tipos-pvp.component.html',
  styleUrls: ['./tipos-pvp.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class TiposPVPComponent implements OnInit {
  // Variables de la aplicación
  tiposPVP: any[] = []; // Lista de tipos de PVP
  tiposPVPFiltrados: any[] = []; // Lista filtrada para búsquedas
  tiposPVPPaginados: any[] = []; // Lista paginada
  searchValue: string = ''; // Valor de búsqueda
  Math = Math; // Para usar Math en la plantilla

  // Variables para la edición y eliminación
  mostrarFormularioEdicion: boolean = false; // Mostrar/ocultar formulario
  mostrarModalEliminar: boolean = false; // Mostrar/ocultar modal de eliminación
  tipoPVPSeleccionado: any = null; // Tipo de PVP seleccionado para edición
  tipoPVPAEliminar: any = null; // Tipo de PVP seleccionado para eliminación
  esEdicion: boolean = false; // Indica si estamos editando o creando

  // Variables para la paginación
  paginaActual: number = 1; // Página actual
  itemsPorPagina: number = 10; // Ítems por página
  totalRegistros: number = 0; // Total de registros

  // Diccionario de opciones con sus respectivas rutas
  menuRoutes: { [key: string]: string } = {}; // Ahora se obtiene del servicio

  constructor(
    private router: Router,
    private pvpService: PVPService,
    private menuRoutesService: MenuRoutesService // Inyectar el servicio
  ) {}

  ngOnInit(): void {
    // Obtener las rutas del menú desde el servicio
    this.menuRoutes = this.menuRoutesService.getMenuRoutes();
    this.cargarTiposPVP(); // Cargar datos al iniciar
  }

  // Método para cargar los tipos de PVP desde el servicio
  cargarTiposPVP(): void {
    this.tiposPVP = this.pvpService.getTiposPVP();
    this.actualizarListaTiposPVP();
  }

  // Método para filtrar la lista de tipos de PVP
  actualizarListaTiposPVP(): void {
    this.tiposPVPFiltrados = this.tiposPVP.filter(
      (tipo) =>
        tipo.tipoPrecio.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        tipo.descripcion.toLowerCase().includes(this.searchValue.toLowerCase())
    );
    this.totalRegistros = this.tiposPVPFiltrados.length;
    this.actualizarPaginacion();
  }

  // Método para actualizar la paginación
  actualizarPaginacion(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.tiposPVPPaginados = this.tiposPVPFiltrados.slice(inicio, fin);
  }

  // Método para cambiar de página
  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= Math.ceil(this.totalRegistros / this.itemsPorPagina)) {
      this.paginaActual = pagina;
      this.actualizarPaginacion();
    }
  }

  // Método para cambiar la cantidad de ítems por página
  cambiarItemsPorPagina(cantidad: number): void {
    this.itemsPorPagina = cantidad;
    this.paginaActual = 1; // Reiniciar a la primera página
    this.actualizarPaginacion();
  }

  // Método para abrir el formulario de agregar
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

  // Método para abrir el formulario de edición
  editarTipoPVP(tipo: any): void {
    this.tipoPVPSeleccionado = { ...tipo };
    this.esEdicion = true;
    this.mostrarFormularioEdicion = true;
  }

  // Método para guardar (crear o actualizar) un tipo de PVP
  guardarTipoPVP(): void {
    if (this.esEdicion) {
      this.tiposPVP = this.pvpService.actualizarTipoPVP(this.tipoPVPSeleccionado);
    } else {
      this.tiposPVP = this.pvpService.agregarTipoPVP(this.tipoPVPSeleccionado);
    }
    this.actualizarListaTiposPVP();
    this.mostrarFormularioEdicion = false;
  }

  // Método para cancelar la edición
  cancelarEdicion(): void {
    this.mostrarFormularioEdicion = false;
    this.tipoPVPSeleccionado = null;
  }

  // Método para abrir el modal de eliminación
  abrirModalEliminar(tipo: any): void {
    this.tipoPVPAEliminar = tipo;
    this.mostrarModalEliminar = true;
  }

  // Método para cerrar el modal de eliminación
  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.tipoPVPAEliminar = null;
  }

  // Método para eliminar un tipo de PVP
  eliminarTipoPVP(): void {
    if (this.tipoPVPAEliminar) {
      this.tiposPVP = this.pvpService.eliminarTipoPVP(this.tipoPVPAEliminar.tipoPrecio);
      this.actualizarListaTiposPVP();
      this.cerrarModalEliminar();
    }
  }

  // Método para redireccionar según la opción seleccionada
  navigateTo(option: string): void {
    const ruta = this.menuRoutes[option];
    if (ruta) {
      this.router.navigate([`/${ruta}`]);
    }
  }

  // Método para verificar si la opción está activa
  isActive(option: string): boolean {
    return this.router.url.includes(this.menuRoutes[option]);
  }
}

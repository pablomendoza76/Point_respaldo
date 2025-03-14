import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoProductoService } from '../../services/productos_services/tipo-producto.service';
import { MenuRoutesService } from '../../services/servicios_compartidos/menu-routes.service'; // Importar el servicio

@Component({
  selector: 'app-tipos-productos',
  standalone: true,
  templateUrl: './tipos-productos.component.html',
  styleUrls: ['./tipos-productos.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class TiposProductosComponent implements OnInit {
  // Variables de la aplicación
  tiposProductos: any[] = [];
  tiposProductosFiltrados: any[] = [];
  tiposProductosPaginados: any[] = []; // Nueva propiedad para la lista paginada
  searchValue: string = '';
  Math = Math;

  // Variables para la edición y eliminación de tipos de productos
  mostrarFormularioEdicion: boolean = false;
  mostrarModalEliminar: boolean = false;
  tipoProductoSeleccionado: any = null;
  tipoProductoAEliminar: any | null = null;
  esEdicion: boolean = false;

  // Variables para la paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 10; // Valor por defecto: 10
  totalRegistros: number = 0;

  // Variables para el menú de administración
  isAdminMenuCollapsed: boolean = false;

  // Rutas del menú
  menuRoutes: { [key: string]: string } = {};

  constructor(
    private router: Router,
    private tipoProductoService: TipoProductoService,
    private menuRoutesService: MenuRoutesService // Inyectar el servicio
  ) {}

  ngOnInit(): void {
    this.cargarTiposProductos();
    this.menuRoutes = this.menuRoutesService.getMenuRoutes(); // Obtener rutas del menú
  }

  // Método para cargar los tipos de productos desde el servicio
  cargarTiposProductos(): void {
    this.tiposProductos = this.tipoProductoService.getTiposProductos();
    this.actualizarListaTiposProductos();
  }

  // Método para actualizar la lista de tipos de productos
  actualizarListaTiposProductos(): void {
    this.tiposProductosFiltrados = this.tiposProductos.filter(
      (tipo) =>
        tipo.nombre.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        tipo.descripcion.toLowerCase().includes(this.searchValue.toLowerCase())
    );
    this.totalRegistros = this.tiposProductosFiltrados.length;
    this.actualizarPaginacion();
  }

  // Método para actualizar la lista paginada
  actualizarPaginacion(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.tiposProductosPaginados = this.tiposProductosFiltrados.slice(inicio, fin);
  }

  // Método para cambiar de página
  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= Math.ceil(this.totalRegistros / this.itemsPorPagina)) {
      this.paginaActual = pagina;
      this.actualizarPaginacion();
    }
  }

  // Método para cambiar la cantidad de elementos por página
  cambiarItemsPorPagina(cantidad: number): void {
    this.itemsPorPagina = cantidad;
    this.paginaActual = 1; // Reiniciar a la primera página
    this.actualizarPaginacion();
  }

  // Métodos para agregar, editar y eliminar tipos de productos
  agregarTipoProducto(): void {
    this.tipoProductoSeleccionado = {
      nombre: '',
      descripcion: '',
      codigoSustento: '',
      visible: 'Activado',
      estado: 'Activado',
    };
    this.esEdicion = false;
    this.mostrarFormularioEdicion = true;
  }

  editarTipoProducto(tipo: any): void {
    this.tipoProductoSeleccionado = { ...tipo };
    this.esEdicion = true;
    this.mostrarFormularioEdicion = true;
  }

  guardarTipoProducto(): void {
    if (this.esEdicion) {
      this.tiposProductos = this.tipoProductoService.actualizarTipoProducto(this.tipoProductoSeleccionado);
    } else {
      this.tiposProductos = this.tipoProductoService.agregarTipoProducto(this.tipoProductoSeleccionado);
    }
    this.actualizarListaTiposProductos();
    this.mostrarFormularioEdicion = false;
  }

  cancelarEdicion(): void {
    this.mostrarFormularioEdicion = false;
    this.tipoProductoSeleccionado = null;
  }

  abrirModalEliminar(tipo: any): void {
    this.tipoProductoAEliminar = tipo;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.tipoProductoAEliminar = null;
  }

  eliminarTipoProducto(): void {
    if (this.tipoProductoAEliminar) {
      this.tiposProductos = this.tipoProductoService.eliminarTipoProducto(this.tipoProductoAEliminar.nombre);
      this.actualizarListaTiposProductos();
      this.cerrarModalEliminar();
    }
  }

  // Método para navegar a diferentes rutas
  navigateTo(option: string): void {
    const ruta = this.menuRoutes[option];
    if (ruta) {
      this.router.navigate([ruta]);
    }
  }

  // Método para alternar el menú de administración
  toggleAdminMenu(): void {
    this.isAdminMenuCollapsed = !this.isAdminMenuCollapsed;
  }

  // Método para verificar si la opción está activa
  isActive(option: string): boolean {
    const ruta = this.menuRoutes[option];
    return ruta ? this.router.url.includes(ruta) : false;
  }
}
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Importar RouterModule
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoProductoService } from '../../services/productos_services/tipo-producto.service';

@Component({
  selector: 'app-tipos-productos',
  standalone: true,
  templateUrl: './tipos-productos.component.html',
  styleUrls: ['./tipos-productos.component.css'],
  imports: [CommonModule, FormsModule, RouterModule], // Agregar RouterModule aquí
})
export class TiposProductosComponent implements OnInit {
  // Variables de la aplicación
  tiposProductos: any[] = [];
  tiposProductosFiltrados: any[] = [];
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
  itemsPorPagina: number = 10;
  totalRegistros: number = 0;

  // Variables para el menú de administración
  isAdminMenuCollapsed: boolean = false; // Propiedad para el menú colapsable

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
    'Tarifas por Grupo': 'tarifas-por-grupo'
  };

  constructor(private router: Router, private tipoProductoService: TipoProductoService) {}

  ngOnInit(): void {
    this.cargarTiposProductos();
  }

  // Método para cargar los tipos de productos desde el servicio
  cargarTiposProductos(): void {
    this.tiposProductos = this.tipoProductoService.getTiposProductos();
    this.actualizarListaTiposProductos();
  }

  actualizarListaTiposProductos(): void {
    this.tiposProductosFiltrados = this.tiposProductos.filter(tipo =>
      tipo.nombre.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      tipo.descripcion.toLowerCase().includes(this.searchValue.toLowerCase())
    );
    this.totalRegistros = this.tiposProductosFiltrados.length;
  }

  agregarTipoProducto(): void {
    this.tipoProductoSeleccionado = {
      nombre: '',
      descripcion: '',
      codigoSustento: '',
      visible: 'Activado',
      estado: 'Activado'
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
    return this.router.url.includes(this.menuRoutes[option]);
  }
}
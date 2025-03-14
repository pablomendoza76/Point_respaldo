import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdministracionServicios } from '../../services/productos_services/administracion.service';
import { MenuRoutesService } from '../../services/servicios_compartidos/menu-routes.service'; // Importar el servicio
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-vista-general',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './vista-general.component.html',
  styleUrl: './vista-general.component.css',
})
export class VistaGeneralComponent implements OnInit {
  // Variables de la aplicación
  menuOptions: string[] = [];
  productos: any[] = [];
  productosFiltrados: any[] = [];
  productosPaginados: any[] = [];
  columnasDisponibles: any[] = [];
  columnasVisibles: any[] = [];
  grupos: string[] = [];
  subGrupos: string[] = [];
  marcas: string[] = [];
  tiposProducto: string[] = [];
  origenes: string[] = [];
  regimenes: string[] = [];
  ices: string[] = [];
  cuentas: string[] = [];
  Math = Math;

  // Variables de filtro
  filtroGrupo: string = '';
  filtroMarca: string = '';
  searchType: string = 'codigo';
  searchValue: string = '';
  filtroActivo: string = 'todos'; // Nueva propiedad para manejar el filtro activo

  mostrarFiltros: boolean = false;
  mostrarColumnas: boolean = false;
  isAdminMenuCollapsed: boolean = true;

  // Variables para la edición y eliminación de productos
  mostrarFormularioEdicion: boolean = false;
  mostrarModalEliminar: boolean = false;
  productoSeleccionado: any = null;
  productoAEliminar: any | null = null;
  esEdicion: boolean = false;

  // Variables para la paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 10; // Cambiado a 10 productos por página
  totalRegistros: number = 0;

  // Variable para manejar la ruta activa en el navbar
  paginaActualNav: string = '/productos'; // Ruta inicial

  // Rutas del menú
  menuRoutes: { [key: string]: string } = {};

  constructor(
    private adminService: AdministracionServicios,
    private router: Router,
    private menuRoutesService: MenuRoutesService // Inyectar el servicio
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
    this.menuRoutes = this.menuRoutesService.getMenuRoutes(); // Obtener rutas del menú
    this.router.events.subscribe(() => {
      this.paginaActualNav = this.router.url; // Actualiza la ruta activa
    });
  }

  // Método para obtener el nombre de la página actual
  obtenerNombrePagina(ruta: string): string {
    switch (ruta) {
      case '/productos/vistageneral':
        return 'Vista General';
      case '/productos/detalles':
        return 'Detalles';
      case '/productos/categorias':
        return 'Categorías';
      default:
        return '';
    }
  }

  // Método dinámico para redireccionar según la opción seleccionada
  navigateTo(option: string): void {
    const ruta = this.menuRoutes[option];
    if (ruta) {
      this.router.navigate([ruta]);
    } else if (option === 'Importar') {
      this.router.navigate(['/importar']);
    }
  }

  exportarExcel(): void {
    let tabla = document.querySelector('table'); // Asumiendo que la tabla está en el HTML
    let ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tabla);
    let wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    XLSX.writeFile(wb, 'productos.xlsx');
  }

  agregarProducto(): void {
    this.productoSeleccionado = {
      codigo: '',
      nombre: '',
      descripcion: '',
      tipo: '',
      grupo: '',
      subGrupo: '',
      marca: '',
      stock: 0,
      estado: 'activo', // Ahora los nuevos productos inician como "activo"
      stockMinimo: 10,
      stockMaximo: 1000,
    };
    this.esEdicion = false;
    this.mostrarFormularioEdicion = true;
  }

  cargarDatos(): void {
    this.menuOptions = this.adminService.getMenuOptions();
    this.productos = this.adminService.getProductos();
    this.actualizarListaProductos();
    this.columnasDisponibles = this.adminService.getColumnas();
    this.columnasVisibles = this.columnasDisponibles.filter(
      (col) => col.default
    );
    this.grupos = this.adminService.getGrupos();
    this.subGrupos = this.adminService.getSubGrupos();
    this.marcas = this.adminService.getMarcas();
    this.tiposProducto = this.adminService.getTiposProducto();
    this.origenes = this.adminService.getOrigenes();
    this.regimenes = this.adminService.getRegimenes();
    this.ices = this.adminService.getICES();
    this.cuentas = this.adminService.getCuentas();
    this.totalRegistros = this.productosFiltrados.length; // Actualizar el total de registros
    this.actualizarPaginacion();
  }

  // Método para actualizar la lista de productos según la búsqueda
  actualizarListaProductos(): void {
    // Filtrar solo productos activos
    this.productosFiltrados = this.productos.filter(
      (p) => p.estado === 'activo'
    );

    // Aplicar filtro de búsqueda
    if (this.searchValue) {
      this.productosFiltrados = this.productosFiltrados.filter((p) => {
        const searchField = p[this.searchType];
        return (
          searchField &&
          searchField
            .toString()
            .toLowerCase()
            .includes(this.searchValue.toLowerCase())
        );
      });
    }

    // Aplicar filtros adicionales (grupo, marca, etc.)
    if (this.filtroGrupo) {
      this.productosFiltrados = this.productosFiltrados.filter(
        (p) => p.grupo === this.filtroGrupo
      );
    }

    if (this.filtroMarca) {
      this.productosFiltrados = this.productosFiltrados.filter(
        (p) => p.marca === this.filtroMarca
      );
    }

    this.totalRegistros = this.productosFiltrados.length; // Actualizar el total de registros
    this.actualizarPaginacion();
  }

  // Método para cambiar el tipo de búsqueda
  cambiarTipoBusqueda(): void {
    this.searchValue = ''; // Limpiar el valor de búsqueda al cambiar el tipo
    this.actualizarListaProductos(); // Actualizar la lista de productos
  }

  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  toggleColumnas(): void {
    this.mostrarColumnas = !this.mostrarColumnas;
  }

  toggleAdminMenu(): void {
    this.isAdminMenuCollapsed = !this.isAdminMenuCollapsed;
  }

  actualizarColumnas(): void {
    this.columnasVisibles = this.columnasDisponibles.filter(
      (col) => col.selected
    );
  }

  aplicarFiltros(filtro?: string): void {
    this.filtroActivo = filtro || 'todos'; // Actualiza el filtro activo

    let productosFiltrados = [...this.productos].filter(
      (p) => p.estado === 'activo'
    );

    if (this.filtroGrupo) {
      productosFiltrados = productosFiltrados.filter(
        (p) => p.grupo === this.filtroGrupo
      );
    }

    if (this.filtroMarca) {
      productosFiltrados = productosFiltrados.filter(
        (p) => p.marca === this.filtroMarca
      );
    }

    if (filtro === 'stock') {
      productosFiltrados = productosFiltrados.filter((p) => p.stock > 0);
    } else if (filtro === 'medio') {
      productosFiltrados = productosFiltrados.filter((p) => {
        let promedioStock = (p.stockMinimo + p.stockMaximo) / 2;
        return p.stock > 0 && p.stock < promedioStock;
      });
    } else if (filtro === 'sin_stock') {
      productosFiltrados = productosFiltrados.filter((p) => p.stock === 0);
    }

    this.productosFiltrados = productosFiltrados;
    this.totalRegistros = this.productosFiltrados.length; // Actualizar el total de registros
    this.actualizarPaginacion();
  }

  // Métodos para la edición de productos
  editarProducto(producto: any): void {
    this.productoSeleccionado = { ...producto };
    this.esEdicion = true;
    this.mostrarFormularioEdicion = true;
  }

  guardarProducto(): void {
    if (this.esEdicion) {
      const index = this.productos.findIndex(
        (p) => p.codigo === this.productoSeleccionado.codigo
      );
      if (index !== -1) {
        this.productos[index] = { ...this.productoSeleccionado };
      }
    } else {
      this.productoSeleccionado.codigo = Date.now().toString(); // Generar ID único
      this.productoSeleccionado.estado = 'activo';
      this.productos.push({ ...this.productoSeleccionado });
    }
    this.actualizarListaProductos();
    this.mostrarFormularioEdicion = false;
  }

  cancelarEdicion(): void {
    this.mostrarFormularioEdicion = false;
    this.productoSeleccionado = null;
  }

  // Métodos para eliminación de productos
  abrirModalEliminar(producto: any): void {
    this.productoAEliminar = producto;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.productoAEliminar = null;
  }

  eliminarProducto(): void {
    if (this.productoAEliminar) {
      this.productoAEliminar.estado = 'inactivo';
      this.actualizarListaProductos();
      this.cerrarModalEliminar();
    }
  }

  // Método para cambiar de página
  cambiarPagina(pagina: number): void {
    if (
      pagina >= 1 &&
      pagina <= Math.ceil(this.totalRegistros / this.itemsPorPagina)
    ) {
      this.paginaActual = pagina;
      this.actualizarPaginacion();
    }
  }

  // Método para actualizar la paginación
  actualizarPaginacion(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.productosPaginados = this.productosFiltrados.slice(inicio, fin);
  }

  // Método para cambiar la cantidad de productos por página
  cambiarItemsPorPagina(cantidad: number): void {
    this.itemsPorPagina = cantidad;
    this.paginaActual = 1; // Reiniciar a la primera página
    this.actualizarPaginacion();
  }

  // Método para verificar si la opción está activa
  isActive(option: string): boolean {
    const ruta = this.menuRoutes[option];
    return ruta ? this.router.url.includes(ruta) : false;
  }
}
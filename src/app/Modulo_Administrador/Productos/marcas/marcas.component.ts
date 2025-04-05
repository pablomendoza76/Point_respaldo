import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MarcasService } from '../../../services/productos_services/marcas.service';
import { MenuRoutesService } from '../../../services/servicios_compartidos/menu-routes.service'; // Importar el servicio
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-marcas',
  standalone: true,
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.scss'],
  imports: [CommonModule, RouterModule, FormsModule],
})
export class MarcasComponent implements OnInit {
  marcas: any[] = [];
  marcasFiltradas: any[] = [];
  marcasPaginadas: any[] = [];
  columnasDisponibles: any[] = [
    { key: 'nombre', name: 'Nombre', selected: true },
    { key: 'descripcion', name: 'Descripción', selected: true },
  ];
  columnasVisibles: any[] = [];
  searchValue: string = '';
  searchType: string = 'nombre'; // Propiedad agregada para el tipo de búsqueda
  mostrarFormularioEdicion: boolean = false;
  mostrarModalEliminar: boolean = false;
  marcaSeleccionada: any = null;
  marcaAEliminar: any | null = null;
  esEdicion: boolean = false;
  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  totalRegistros: number = 0;
  isAdminMenuCollapsed: boolean = false;
  Math = Math;
  mostrarColumnas: boolean = false;

  // Breadcrumb (barra de navegación)
  breadcrumb: { label: string; path: string | null }[] = [];

  // Rutas del menú
  menuRoutes: { [key: string]: string } = {};

  constructor(
    private marcasService: MarcasService,
    private router: Router,
    private menuRoutesService: MenuRoutesService // Inyectar el servicio
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.actualizarBreadcrumb();
      }
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
    this.actualizarBreadcrumb();
    this.columnasVisibles = this.columnasDisponibles.filter((col) => col.selected);
    this.menuRoutes = this.menuRoutesService.getMenuRoutes(); // Obtener rutas del menú
  }

  cargarDatos(): void {

    this.actualizarListaMarcas();
  }

  actualizarListaMarcas(): void {
    this.marcasFiltradas = this.marcas.filter((m) =>
      m[this.searchType].toLowerCase().includes(this.searchValue.toLowerCase())
    );
    this.totalRegistros = this.marcasFiltradas.length;
    this.actualizarPaginacion();
  }

  agregarMarca(): void {
    this.marcaSeleccionada = { nombre: '', descripcion: '' };
    this.esEdicion = false;
    this.mostrarFormularioEdicion = true;
  }

  editarMarca(marca: any): void {
    this.marcaSeleccionada = { ...marca };
    this.esEdicion = true;
    this.mostrarFormularioEdicion = true;
  }

  guardarMarca(): void {
    if (this.esEdicion) {
      const index = this.marcas.findIndex((m) => m.nombre === this.marcaSeleccionada.nombre);
      if (index !== -1) {
        this.marcas[index] = { ...this.marcaSeleccionada };
      }
    } else {
      this.marcas.push({ ...this.marcaSeleccionada });
    }
    this.actualizarListaMarcas();
    this.mostrarFormularioEdicion = false;
  }

  cancelarEdicion(): void {
    this.mostrarFormularioEdicion = false;
    this.marcaSeleccionada = null;
  }

  abrirModalEliminar(marca: any): void {
    this.marcaAEliminar = marca;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.marcaAEliminar = null;
  }

  eliminarMarca(): void {
    if (this.marcaAEliminar) {
      this.marcas = this.marcas.filter((m) => m.nombre !== this.marcaAEliminar.nombre);
      this.actualizarListaMarcas();
      this.cerrarModalEliminar();
    }
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= Math.ceil(this.totalRegistros / this.itemsPorPagina)) {
      this.paginaActual = pagina;
      this.actualizarPaginacion();
    }
  }

  actualizarPaginacion(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.marcasPaginadas = this.marcasFiltradas.slice(inicio, fin);
  }

  cambiarItemsPorPagina(cantidad: number): void {
    this.itemsPorPagina = cantidad;
    this.paginaActual = 1; // Reiniciar a la primera página
    this.actualizarPaginacion();
  }

  cambiarTipoBusqueda(): void {
    this.searchValue = ''; // Limpiar el valor de búsqueda al cambiar el tipo
    this.actualizarListaMarcas(); // Actualizar la lista de marcas
  }

  toggleColumnas(): void {
    this.mostrarColumnas = !this.mostrarColumnas;
  }

  actualizarColumnas(): void {
    this.columnasVisibles = this.columnasDisponibles.filter((col) => col.selected);
  }

  exportarExcel(): void {
    let tabla = document.querySelector('table'); // Asumiendo que la tabla está en el HTML
    let ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tabla);
    let wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Marcas');
    XLSX.writeFile(wb, 'marcas.xlsx');
  }

  toggleAdminMenu(): void {
    this.isAdminMenuCollapsed = !this.isAdminMenuCollapsed;
  }

  navigateTo(option: string): void {
    const ruta = this.menuRoutes[option];
    if (ruta) {
      this.router.navigate([ruta]);
      this.actualizarBreadcrumb();
    }
  }

  actualizarBreadcrumb(): void {
    const currentRoute = this.router.url.split('/').filter((part) => part); // Obtiene las partes de la ruta
    this.breadcrumb = [];

    if (currentRoute.includes('productos')) {
      this.breadcrumb.push({ label: 'Productos', path: '/productos' });
    }
    if (currentRoute.includes('marcas')) {
      this.breadcrumb.push({ label: 'Marcas', path: null });
    }
  }

  isActive(option: string): boolean {
    const ruta = this.menuRoutes[option];
    return ruta ? this.router.url.includes(ruta) : false;
  }
}

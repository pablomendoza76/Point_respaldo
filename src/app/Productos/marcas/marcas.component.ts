import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MarcasService } from '../../services/productos_services/marcas.service';

@Component({
  selector: 'app-marcas',
  standalone: true,
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.css'],
  imports: [CommonModule, RouterModule, FormsModule],
})
export class MarcasComponent implements OnInit {
  marcas: any[] = [];
  marcasFiltradas: any[] = [];
  searchValue: string = '';
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

  // Breadcrumb (barra de navegación)
  breadcrumb: { label: string; path: string | null }[] = [];

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

  constructor(private marcasService: MarcasService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.actualizarBreadcrumb();
      }
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
    this.actualizarBreadcrumb();
  }

  cargarDatos(): void {
    this.marcas = this.marcasService.getMarcas();
    this.actualizarListaMarcas();
  }

  actualizarListaMarcas(): void {
    this.marcasFiltradas = this.marcas.filter(m => m.nombre.toLowerCase().includes(this.searchValue.toLowerCase()));
    this.totalRegistros = this.marcasFiltradas.length;
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
      const index = this.marcas.findIndex(m => m.nombre === this.marcaSeleccionada.nombre);
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
      this.marcas = this.marcas.filter(m => m.nombre !== this.marcaAEliminar.nombre);
      this.actualizarListaMarcas();
      this.cerrarModalEliminar();
    }
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= Math.ceil(this.totalRegistros / this.itemsPorPagina)) {
      this.paginaActual = pagina;
    }
  }

  toggleAdminMenu(): void {
    this.isAdminMenuCollapsed = !this.isAdminMenuCollapsed;
  }

  navigateTo(option: string): void {
    const ruta = this.menuRoutes[option];
    if (ruta) {
      this.router.navigate([`/${ruta}`]);
      this.actualizarBreadcrumb();
    }
  }

  actualizarBreadcrumb(): void {
    const currentRoute = this.router.url.split('/').filter(part => part); // Obtiene las partes de la ruta
    this.breadcrumb = [];

    if (currentRoute.includes('productos')) {
      this.breadcrumb.push({ label: 'Productos', path: '/productos' });
    }
    if (currentRoute.includes('marcas')) {
      this.breadcrumb.push({ label: 'Marcas', path: null });
    }
  }

  //metodo para saber donde estamos en el segundo menú
  // Método para verificar si la opción está activa
  isActive(option: string): boolean {
    const normalizedOption = option.toLowerCase().replace(/\s+/g, '-');
    console.log(`Ruta actual: ${this.router.url}, Opción: ${normalizedOption}`);
    return this.router.url.includes(normalizedOption);
  }
}

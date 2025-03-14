import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProveedoresService } from '../../services/proveedores_services/proveedores.service';
import { MenuRoutesService } from '../../services/servicios_compartidos/menu-routes.service'; // Importar el servicio
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
  imports: [CommonModule, RouterModule, FormsModule],
})
export class ProveedoresComponent implements OnInit {
  // Variables de la aplicación
  proveedores: any[] = [];
  proveedoresFiltrados: any[] = [];
  proveedoresPaginados: any[] = [];
  columnasDisponibles: any[] = [];
  columnasVisibles: any[] = [];
  tiposProveedor: string[] = [];
  estados: string[] = ['Activo', 'Inactivo'];
  ciudades: string[] = ['Quito', 'Guayaquil', 'Cuenca'];
  cantones: string[] = ['Cantón 1', 'Cantón 2', 'Cantón 3'];
  retenciones: any[] = [];
  retencionesFiltradas: any[] = [];
  busquedaRetencion: string = '';

  // Variables de filtro
  filtroTipoProveedor: string = '';
  filtroEstado: string = '';
  searchType: string = 'identificacion';
  searchValue: string = '';
  filtroActivo: string = 'todos'; // Nueva propiedad para manejar el filtro activo

  mostrarFiltros: boolean = false;
  mostrarColumnas: boolean = false;

  // Variables para la edición y eliminación de proveedores
  mostrarFormularioEdicion: boolean = false;
  mostrarModalEliminar: boolean = false;
  proveedorSeleccionado: any = null;
  proveedorAEliminar: any | null = null;
  esEdicion: boolean = false;

  // Variables para la paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  totalRegistros: number = 0;

  // Variable para manejar la ruta activa en el navbar
  paginaActualNav: string = '/proveedores'; // Ruta inicial

  // Diccionario de opciones con sus respectivas rutas
  menuRoutes: { [key: string]: string } = {};

  // Hacer Math disponible en la plantilla
  Math = Math;

  constructor(
    private proveedoresService: ProveedoresService,
    private router: Router,
    private menuRoutesService: MenuRoutesService // Inyectar el servicio
  ) {}

  ngOnInit(): void {
    // Obtener las rutas del menú desde el servicio
    this.menuRoutes = this.menuRoutesService.getMenuRoutes();
    this.cargarDatos();
    this.router.events.subscribe(() => {
      this.paginaActualNav = this.router.url; // Actualiza la ruta activa
    });
  }

  // Método para redireccionar según la opción seleccionada
  navigateTo(option: string): void {
    const ruta = this.menuRoutes[option];
    if (ruta) {
      this.router.navigate([`/${ruta}`]);
    } else if (option === 'Importar') {
      this.router.navigate(['/importar']);
    }
  }

  // Método para alternar la visibilidad de las columnas
  toggleColumnas(): void {
    this.mostrarColumnas = !this.mostrarColumnas;
  }

  // Método para actualizar las columnas visibles
  actualizarColumnas(): void {
    this.columnasVisibles = this.columnasDisponibles.filter(col => col.selected);
  }

  // Método para exportar a Excel
  exportarExcel(): void {
    const tabla = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Crear el encabezado de la tabla
    const headerRow = document.createElement('tr');
    this.columnasVisibles.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col.name;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    tabla.appendChild(thead);

    // Crear las filas de la tabla
    this.proveedoresFiltrados.forEach(proveedor => {
      const row = document.createElement('tr');
      this.columnasVisibles.forEach(col => {
        const td = document.createElement('td');
        td.textContent = proveedor[col.key];
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
    tabla.appendChild(tbody);

    // Exportar la tabla a Excel
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tabla);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Proveedores');
    XLSX.writeFile(wb, 'proveedores.xlsx');
  }

  // Método para cargar datos iniciales
  cargarDatos(): void {
    this.proveedores = this.proveedoresService.getProveedores();
    this.actualizarListaProveedores();
    this.columnasDisponibles = this.proveedoresService.getColumnas();
    this.columnasVisibles = this.columnasDisponibles.filter(col => col.default);
    this.tiposProveedor = this.proveedoresService.getTiposProveedor();
    this.retenciones = this.proveedoresService.getRetenciones();
    this.totalRegistros = this.proveedoresFiltrados.length;
    this.actualizarPaginacion();
  }

  // Método para actualizar la lista de proveedores
  actualizarListaProveedores(): void {
    // Filtrar solo proveedores activos
    this.proveedoresFiltrados = this.proveedores.filter(p => p.estado === 'Activo');

    // Aplicar filtro de búsqueda
    if (this.searchValue) {
      this.proveedoresFiltrados = this.proveedoresFiltrados.filter(proveedor => {
        const searchField = proveedor[this.searchType];
        return (
          searchField &&
          searchField.toString().toLowerCase().includes(this.searchValue.toLowerCase())
        );
      });
    }

    // Aplicar filtros adicionales (tipo de proveedor, estado, etc.)
    if (this.filtroTipoProveedor) {
      this.proveedoresFiltrados = this.proveedoresFiltrados.filter(
        p => p.tipoProveedor === this.filtroTipoProveedor
      );
    }

    if (this.filtroEstado) {
      this.proveedoresFiltrados = this.proveedoresFiltrados.filter(
        p => p.estado === this.filtroEstado
      );
    }

    this.totalRegistros = this.proveedoresFiltrados.length;
    this.actualizarPaginacion();
  }

  // Método para cambiar el tipo de búsqueda
  cambiarTipoBusqueda(): void {
    this.searchValue = '';
    this.actualizarListaProveedores();
  }

  // Método para aplicar filtros
  aplicarFiltros(filtro?: string): void {
    this.filtroActivo = filtro || 'todos'; // Actualiza el filtro activo
    this.actualizarListaProveedores();
  }

  // Método para actualizar la paginación
  actualizarPaginacion(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.proveedoresPaginados = this.proveedoresFiltrados.slice(inicio, fin);
  }

  // Método para cambiar de página
  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= Math.ceil(this.totalRegistros / this.itemsPorPagina)) {
      this.paginaActual = pagina;
      this.actualizarPaginacion();
    }
  }

  // Método para cambiar la cantidad de proveedores por página
  cambiarItemsPorPagina(cantidad: number): void {
    this.itemsPorPagina = cantidad;
    this.paginaActual = 1; // Reiniciar a la primera página
    this.actualizarPaginacion();
  }

  // Método para agregar un nuevo proveedor
  agregarProveedor(): void {
    this.proveedorSeleccionado = {
      tipoDocumento: 'CI/RUC',
      sujeto: 'Natural',
      identificacion: '',
      nombres: '',
      apellidos: '',
      direccion: '',
      tipoProveedor: '',
      telefono: '',
      correo: '',
      correo2: '',
      razonSocial: '',
      establecimiento: '',
      documento: 'Factura',
      autorizacionSRI: '',
      puntoEmision: '',
      fechaCaducidad: '',
      ingresosMensuales: 0,
      ciudad: '',
      canton: '',
      retenciones: [],
      estado: 'Activo'
    };
    this.esEdicion = false;
    this.mostrarFormularioEdicion = true;
  }

  // Método para guardar un proveedor
  guardarProveedor(): void {
    if (this.esEdicion) {
      const index = this.proveedores.findIndex(p => p.identificacion === this.proveedorSeleccionado.identificacion);
      if (index !== -1) {
        this.proveedores[index] = { ...this.proveedorSeleccionado };
      }
    } else {
      this.proveedores.push({ ...this.proveedorSeleccionado });
    }
    this.actualizarListaProveedores();
    this.mostrarFormularioEdicion = false;
  }

  // Método para cancelar la edición
  cancelarEdicion(): void {
    this.mostrarFormularioEdicion = false;
    this.proveedorSeleccionado = null;
  }

  // Método para editar un proveedor
  editarProveedor(proveedor: any): void {
    this.proveedorSeleccionado = { ...proveedor };
    this.esEdicion = true;
    this.mostrarFormularioEdicion = true;
  }

  // Método para abrir el modal de eliminación
  abrirModalEliminar(proveedor: any): void {
    this.proveedorAEliminar = proveedor;
    this.mostrarModalEliminar = true;
  }

  // Método para cerrar el modal de eliminación
  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.proveedorAEliminar = null;
  }

  // Método para eliminar un proveedor
  eliminarProveedor(): void {
    if (this.proveedorAEliminar) {
      this.proveedorAEliminar.estado = 'Inactivo';
      this.actualizarListaProveedores();
      this.cerrarModalEliminar();
    }
  }

  // Método para buscar retenciones
  buscarRetencion(): void {
    this.retencionesFiltradas = this.retenciones.filter(r =>
      r.descripcion.toLowerCase().includes(this.busquedaRetencion.toLowerCase())
    );
  }

  // Método para agregar una retención
  agregarRetencion(retencion: any): void {
    if (!this.proveedorSeleccionado.retenciones.some((r: any) => r.codigo === retencion.codigo)) {
      this.proveedorSeleccionado.retenciones.push(retencion);
    }
  }

  // Método para quitar una retención
  quitarRetencion(retencion: any): void {
    this.proveedorSeleccionado.retenciones = this.proveedorSeleccionado.retenciones.filter((r: any) => r.codigo !== retencion.codigo);
  }

  // Método para pasar todas las retenciones
  pasarTodos(): void {
    this.proveedorSeleccionado.retenciones = [...this.retenciones];
  }

  // Método para quitar todas las retenciones
  quitarTodos(): void {
    this.proveedorSeleccionado.retenciones = [];
  }

  // Método para verificar si la opción está activa
  isActive(option: string): boolean {
    return this.router.url.includes(this.menuRoutes[option]);
  }
}
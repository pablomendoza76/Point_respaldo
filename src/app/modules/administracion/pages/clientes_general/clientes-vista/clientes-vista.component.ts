import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../../services/clientes_services/clientes.service';
import { MenuRoutesService } from '../../../services/servicios_compartidos/menu-routes.service'; // Importar el servicio
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-clientes-vista',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './clientes-vista.component.html',
  styleUrl: './clientes-vista.component.scss',
})
export class ClientesVistaComponent implements OnInit {
  // Variables de la aplicación
  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  columnasDisponibles: any[] = [];
  columnasVisibles: any[] = [];
  tiposCliente: string[] = [];
  estados: string[] = ['Activo', 'Inactivo'];
  ciudades: string[] = ['Quito', 'Guayaquil', 'Cuenca'];
  cantones: string[] = ['Cantón 1', 'Cantón 2', 'Cantón 3'];
  retenciones: any[] = [];
  retencionesFiltradas: any[] = [];
  busquedaRetencion: string = '';

  // Variables de filtro
  filtroTipoCliente: string = '';
  filtroEstado: string = '';
  searchType: string = 'cedula';
  searchValue: string = '';

  mostrarFiltros: boolean = false;
  mostrarColumnas: boolean = false;
  isAdminMenuCollapsed: boolean = true;

  // Variables para la edición y eliminación de clientes
  mostrarFormularioEdicion: boolean = false;
  mostrarModalEliminar: boolean = false;
  clienteSeleccionado: any = null;
  clienteAEliminar: any | null = null;
  esEdicion: boolean = false;

  // Variables para la paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  totalRegistros: number = 0;

  // Hacer Math disponible en la plantilla
  Math = Math;

  menuRoutes: { [key: string]: string } = {};


  constructor(
    private clientesService: ClientesService,
    private router: Router,
    private menuRoutesService: MenuRoutesService // Inyectar el servicio
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
    this.menuRoutes = this.menuRoutesService.getMenuRoutes(); // Obtener rutas del menú
  }

  // Método para redireccionar según la opción seleccionada
  navigateTo(option: string): void {
    const ruta = this.menuRoutes[option];
    if (ruta) {
      this.router.navigate([`dashboard/${ruta}`])
    }
  }

  // Método para alternar el menú de administración
  toggleAdminMenu(): void {
    this.isAdminMenuCollapsed = !this.isAdminMenuCollapsed;
  }

  // Método para alternar la visibilidad de las columnas
  toggleColumnas(): void {
    this.mostrarColumnas = !this.mostrarColumnas;
  }

  // Método para actualizar las columnas visibles
  actualizarColumnas(): void {
    this.columnasVisibles = this.columnasDisponibles.filter(
      (col) => col.selected
    );
  }

  // Método para exportar a Excel
  exportarExcel(): void {
    const tabla = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Crear el encabezado de la tabla
    const headerRow = document.createElement('tr');
    this.columnasVisibles.forEach((col) => {
      const th = document.createElement('th');
      th.textContent = col.name;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    tabla.appendChild(thead);

    // Crear las filas de la tabla
    this.clientesFiltrados.forEach((cliente) => {
      const row = document.createElement('tr');
      this.columnasVisibles.forEach((col) => {
        const td = document.createElement('td');
        td.textContent = cliente[col.key];
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
    tabla.appendChild(tbody);

    // Exportar la tabla a Excel
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tabla);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
    XLSX.writeFile(wb, 'clientes.xlsx');
  }

  // Método para cargar datos iniciales
  cargarDatos(): void {
    this.clientes = this.clientesService.getClientes();
    this.actualizarListaClientes();
    this.columnasDisponibles = this.clientesService.getColumnas();
    this.columnasVisibles = this.columnasDisponibles.filter(
      (col) => col.default
    );
    this.tiposCliente = this.clientesService.getTiposCliente();
    this.retenciones = this.clientesService.getRetenciones();
    this.retencionesFiltradas = [...this.retenciones]; // Inicializar con todas las retenciones
  }

  // Método para actualizar la lista de clientes
  actualizarListaClientes(): void {
    this.clientesFiltrados = this.clientes.filter(
      (cliente) => cliente.estado === 'Activo'
    );

    if (this.searchValue) {
      this.clientesFiltrados = this.clientesFiltrados.filter((cliente) => {
        const searchField = cliente[this.searchType];
        return (
          searchField &&
          searchField
            .toString()
            .toLowerCase()
            .includes(this.searchValue.toLowerCase())
        );
      });
    }

    this.totalRegistros = this.clientesFiltrados.length;
  }

  // Método para cambiar el tipo de búsqueda
  cambiarTipoBusqueda(): void {
    this.searchValue = ''; // Limpiar el valor de búsqueda
    this.actualizarListaClientes(); // Actualizar la lista de clientes
  }

  // Método para agregar un nuevo cliente
  agregarCliente(): void {
    this.clienteSeleccionado = {
      tipoDocumento: 'CI/RUC',
      sujeto: 'Natural',
      identificacion: '',
      nombres: '',
      apellidos: '',
      direccion: '',
      tipoCliente: '',
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
      estado: 'Activo',
    };
    this.esEdicion = false;
    this.mostrarFormularioEdicion = true;
  }

  // Método para guardar un cliente
  guardarCliente(): void {
    if (
      !this.clienteSeleccionado.identificacion ||
      !this.clienteSeleccionado.nombres ||
      !this.clienteSeleccionado.apellidos ||
      !this.clienteSeleccionado.direccion ||
      !this.clienteSeleccionado.tipoCliente ||
      !this.clienteSeleccionado.telefono ||
      !this.clienteSeleccionado.correo
    ) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    if (this.esEdicion) {
      const index = this.clientes.findIndex(
        (c) => c.identificacion === this.clienteSeleccionado.identificacion
      );
      if (index !== -1) {
        this.clientes[index] = { ...this.clienteSeleccionado };
      }
    } else {
      this.clientes.push({ ...this.clienteSeleccionado });
    }

    this.actualizarListaClientes();
    this.mostrarFormularioEdicion = false;
  }

  // Método para cancelar la edición
  cancelarEdicion(): void {
    this.mostrarFormularioEdicion = false;
    this.clienteSeleccionado = null;
  }

  // Método para editar un cliente
  editarCliente(cliente: any): void {
    this.clienteSeleccionado = { ...cliente };
    this.esEdicion = true;
    this.mostrarFormularioEdicion = true;
  }

  // Método para abrir el modal de eliminación
  abrirModalEliminar(cliente: any): void {
    this.clienteAEliminar = cliente;
    this.mostrarModalEliminar = true;
  }

  // Método para cerrar el modal de eliminación
  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.clienteAEliminar = null;
  }

  // Método para eliminar un cliente
  eliminarCliente(): void {
    if (this.clienteAEliminar) {
      this.clienteAEliminar.estado = 'Inactivo';
      this.actualizarListaClientes();
      this.cerrarModalEliminar();
    }
  }

  // Método para buscar retenciones
  buscarRetencion(): void {
    if (this.busquedaRetencion) {
      this.retencionesFiltradas = this.retenciones.filter((retencion) =>
        retencion.descripcion
          .toLowerCase()
          .includes(this.busquedaRetencion.toLowerCase())
      );
    } else {
      this.retencionesFiltradas = [...this.retenciones]; // Mostrar todas las retenciones si no hay búsqueda
    }
  }

  // Método para agregar una retención al cliente
  agregarRetencion(retencion: any): void {
    if (
      !this.clienteSeleccionado.retenciones.some(
        (r: any) => r.codigo === retencion.codigo
      )
    ) {
      this.clienteSeleccionado.retenciones.push(retencion);
    }
  }

  // Método para quitar una retención del cliente
  quitarRetencion(retencion: any): void {
    this.clienteSeleccionado.retenciones =
      this.clienteSeleccionado.retenciones.filter(
        (r: any) => r.codigo !== retencion.codigo
      );
  }

  // Método para pasar todas las retenciones al cliente
  pasarTodos(): void {
    this.clienteSeleccionado.retenciones = [...this.retenciones];
  }

  // Método para quitar todas las retenciones del cliente
  quitarTodos(): void {
    this.clienteSeleccionado.retenciones = [];
  }

  // Método para cambiar de página
  cambiarPagina(pagina: number): void {
    if (
      pagina >= 1 &&
      pagina <= Math.ceil(this.totalRegistros / this.itemsPorPagina)
    ) {
      this.paginaActual = pagina;
    }
  }

  // Método para verificar si la opción está activa
  isActive(option: string): boolean {
    const ruta = this.menuRoutes[option];
    return ruta ? this.router.url.includes(ruta) : false;
  }
}

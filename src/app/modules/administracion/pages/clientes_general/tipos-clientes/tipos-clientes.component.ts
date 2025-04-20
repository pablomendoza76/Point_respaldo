import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoClientesService } from '../../../services/clientes_services/tipo-clientes.service';
import { MenuRoutesService } from '../../../services/servicios_compartidos/menu-routes.service';

@Component({
  selector: 'app-tipos-clientes',
  standalone: true,
  templateUrl: './tipos-clientes.component.html',
  styleUrls: ['./tipos-clientes.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class TiposClientesComponent implements OnInit {
  // Variables de la aplicación
  tiposClientes: any[] = []; // Lista de tipos de clientes
  tiposClientesFiltrados: any[] = []; // Lista filtrada para búsquedas
  searchValue: string = ''; // Valor de búsqueda
  searchType: string = 'tipo'; // Tipo de búsqueda (tipo, descripción, descuento)
  Math = Math; // Para usar Math en la plantilla

  // Variables para la edición y eliminación
  mostrarFormularioEdicion: boolean = false; // Mostrar/ocultar formulario
  mostrarModalEliminar: boolean = false; // Mostrar/ocultar modal de eliminación
  tipoClienteSeleccionado: any = null; // Tipo de cliente seleccionado para edición
  tipoClienteAEliminar: any = null; // Tipo de cliente seleccionado para eliminación
  esEdicion: boolean = false; // Indica si estamos editando o creando

  // Variables para la paginación
  paginaActual: number = 1; // Página actual
  itemsPorPagina: number = 10; // Ítems por página
  totalRegistros: number = 0; // Total de registros

  // Opciones dinámicas para el formulario
  tiposGarantia: string[] = [];
  cuentasContables: string[] = [];
  tiposPvp: string[] = [];
  opcionesFactLotes: string[] = ['Activo', 'Inactivo'];
  opcionesPermitirEliminacion: string[] = ['Activo', 'Inactivo'];

  // Diccionario de opciones con sus respectivas rutas
  menuRoutes: { [key: string]: string } = {}; // Ahora se obtiene del servicio

  constructor(
    private router: Router,
    private tipoClientesService: TipoClientesService,
    private menuRoutesService: MenuRoutesService // Inyectar el servicio
  ) {}

  ngOnInit(): void {
    // Obtener las rutas del menú desde el servicio
    this.menuRoutes = this.menuRoutesService.getMenuRoutes();
    this.cargarTiposClientes(); // Cargar datos al iniciar
    this.cargarOpcionesDinamicas(); // Cargar opciones dinámicas
  }

  // Método para cargar los tipos de clientes
  cargarTiposClientes(): void {
    this.tiposClientes = this.tipoClientesService.getTiposClientes();
    this.actualizarListaTiposClientes();
  }

  // Método para cargar las opciones dinámicas
  cargarOpcionesDinamicas(): void {
    this.tiposGarantia = this.tipoClientesService.getTiposGarantia();
    this.cuentasContables = this.tipoClientesService.getCuentasContables();
    this.tiposPvp = this.tipoClientesService.getTiposPvp();
  }

  // Método para filtrar la lista de tipos de clientes
  actualizarListaTiposClientes(): void {
    this.tiposClientesFiltrados = this.tiposClientes.filter((tipo) => {
      const searchField = tipo[this.searchType];
      return (
        searchField &&
        searchField.toString().toLowerCase().includes(this.searchValue.toLowerCase())
      );
    });
    this.totalRegistros = this.tiposClientesFiltrados.length;
    this.actualizarPaginacion();
  }

  // Método para cambiar el tipo de búsqueda
  cambiarTipoBusqueda(): void {
    this.searchValue = ''; // Limpiar el valor de búsqueda al cambiar el tipo
    this.actualizarListaTiposClientes(); // Actualizar la lista de tipos de clientes
  }

  // Método para abrir el formulario de agregar
  agregarTipoCliente(): void {
    this.tipoClienteSeleccionado = {
      tipo: '',
      descripcion: '',
      descuento: 0.0,
      codigoPais: '+593',
      numeroPersonal: '',
      tipoGarantia: '',
      cuentaContable: '',
      precio: 0.0,
      pvpDefecto: 'p.A',
      pvp: '',
      productoDefecto: '',
      factLotes: 'Activo',
      permiteEliminacion: 'Activo',
    };
    this.esEdicion = false;
    this.mostrarFormularioEdicion = true;
  }

  // Método para abrir el formulario de edición
  editarTipoCliente(tipo: any): void {
    this.tipoClienteSeleccionado = { ...tipo };
    this.esEdicion = true;
    this.mostrarFormularioEdicion = true;
  }

  // Método para guardar (crear o actualizar) un tipo de cliente
  guardarTipoCliente(): void {
    if (this.esEdicion) {
      this.tiposClientes = this.tipoClientesService.actualizarTipoCliente(
        this.tipoClienteSeleccionado
      );
    } else {
      this.tiposClientes = this.tipoClientesService.agregarTipoCliente(
        this.tipoClienteSeleccionado
      );
    }
    this.actualizarListaTiposClientes();
    this.mostrarFormularioEdicion = false;
    this.tipoClienteSeleccionado = null; // Limpiar el formulario
  }

  // Método para cancelar la edición
  cancelarEdicion(): void {
    this.mostrarFormularioEdicion = false;
    this.tipoClienteSeleccionado = null;
  }

  // Método para abrir el modal de eliminación
  abrirModalEliminar(tipo: any): void {
    this.tipoClienteAEliminar = tipo;
    this.mostrarModalEliminar = true;
  }

  // Método para cerrar el modal de eliminación
  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.tipoClienteAEliminar = null;
  }

  // Método para eliminar un tipo de cliente
  eliminarTipoCliente(): void {
    if (this.tipoClienteAEliminar) {
      this.tiposClientes = this.tipoClientesService.eliminarTipoCliente(
        this.tipoClienteAEliminar.tipo
      );
      this.actualizarListaTiposClientes();
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
    this.tiposClientesFiltrados = this.tiposClientes.slice(inicio, fin);
  }

  // Método para cambiar la cantidad de ítems por página
  cambiarItemsPorPagina(cantidad: number): void {
    this.itemsPorPagina = cantidad;
    this.paginaActual = 1; // Reiniciar a la primera página
    this.actualizarPaginacion();
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

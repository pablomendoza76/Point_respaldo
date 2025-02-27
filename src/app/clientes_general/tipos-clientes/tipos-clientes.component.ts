import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoClientesService } from '../../services/clientes_services/tipo-clientes.service';

@Component({
  selector: 'app-tipos-clientes',
  standalone: true,
  templateUrl: './tipos-clientes.component.html',
  styleUrls: ['./tipos-clientes.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class TiposClientesComponent implements OnInit {
  // Variables de la aplicación
  tiposClientes: any[] = []; // Lista de tipos de clientes
  tiposClientesFiltrados: any[] = []; // Lista filtrada para búsquedas
  searchValue: string = ''; // Valor de búsqueda
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
  opcionesFactLotes: string[] = [];
  opcionesPermitirEliminacion: string[] = [];

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
    'Tipos de clientes': 'tipo-cliente',
    'Tarifas por Grupo': 'tarifas-por-grupo',
  };

  // Variables para el menú de administración
  isAdminMenuCollapsed: boolean = false; // Menú colapsable

  constructor(
    private router: Router,
    private tipoClientesService: TipoClientesService
  ) {}

  ngOnInit(): void {
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
    this.opcionesFactLotes = this.tipoClientesService.getOpcionesFactLotes();
    this.opcionesPermitirEliminacion = this.tipoClientesService.getOpcionesPermitirEliminacion();
  }

  // Método para filtrar la lista de tipos de clientes
  actualizarListaTiposClientes(): void {
    this.tiposClientesFiltrados = this.tiposClientes.filter(
      (tipo) =>
        tipo.tipo.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        tipo.descripcion.toLowerCase().includes(this.searchValue.toLowerCase())
    );
    this.totalRegistros = this.tiposClientesFiltrados.length;
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
    }
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
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CuentasContablesService } from '../../../services/cuentas-contables.service';
import { MenuRoutesService } from '../../../services/servicios_compartidos/menu-routes.service'; // Importar el servicio

@Component({
  selector: 'app-cuentas-contables',
  standalone: true,
  templateUrl: './cuentas-contables.component.html',
  styleUrls: ['./cuentas-contables.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class CuentasContablesComponent implements OnInit {
  // Variables de la aplicación
  cuentasContables: any[] = []; // Lista de cuentas contables
  cuentasContablesFiltradas: any[] = []; // Lista filtrada para búsquedas
  searchValue: string = ''; // Valor de búsqueda
  Math = Math; // Para usar Math en la plantilla

  // Variables para la edición y eliminación
  mostrarFormularioEdicion: boolean = false; // Mostrar/ocultar formulario
  mostrarModalEliminar: boolean = false; // Mostrar/ocultar modal de eliminación
  cuentaContableSeleccionada: any = null; // Cuenta contable seleccionada para edición
  cuentaContableAEliminar: any = null; // Cuenta contable seleccionada para eliminación
  esEdicion: boolean = false; // Indica si estamos editando o creando

  // Variables para la paginación
  paginaActual: number = 1; // Página actual
  itemsPorPagina: number = 10; // Ítems por página
  totalRegistros: number = 0; // Total de registros

  // Opciones dinámicas para el formulario
  cuentasContablesOptions: string[] = [];
  estados: string[] = [];

  // Diccionario de opciones con sus respectivas rutas
  menuRoutes: { [key: string]: string } = {}; // Ahora se obtiene del servicio

  constructor(
    private router: Router,
    private cuentasContablesService: CuentasContablesService,
    private menuRoutesService: MenuRoutesService // Inyectar el servicio
  ) {}

  ngOnInit(): void {
    // Obtener las rutas del menú desde el servicio
    this.menuRoutes = this.menuRoutesService.getMenuRoutes();
    this.cargarCuentasContables(); // Cargar datos al iniciar
    this.cargarOpcionesDinamicas(); // Cargar opciones dinámicas
  }

  // Método para cargar las cuentas contables
  cargarCuentasContables(): void {
    this.cuentasContables = this.cuentasContablesService.getCuentasContables();
    this.actualizarListaCuentasContables();
  }

  // Método para cargar las opciones dinámicas
  cargarOpcionesDinamicas(): void {
    this.cuentasContablesOptions = this.cuentasContablesService.getCuentasContablesOptions();
    this.estados = this.cuentasContablesService.getEstados();
  }

  // Método para filtrar la lista de cuentas contables
  actualizarListaCuentasContables(): void {
    this.cuentasContablesFiltradas = this.cuentasContables.filter(
      (cuenta) =>
        cuenta.codigo.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        cuenta.nombre.toLowerCase().includes(this.searchValue.toLowerCase())
    );
    this.totalRegistros = this.cuentasContablesFiltradas.length;
  }

  // Método para abrir el formulario de agregar
  agregarCuentaContable(): void {
    this.cuentaContableSeleccionada = {
      codigo: 'CR001', // Código predeterminado
      nombre: '',
      descripcion: '',
      debe: 0,
      haber: 0,
      cuentaContable: '',
      estado: 'Activo',
    };
    this.esEdicion = false;
    this.mostrarFormularioEdicion = true;
  }

  // Método para abrir el formulario de edición
  editarCuentaContable(cuenta: any): void {
    this.cuentaContableSeleccionada = { ...cuenta };
    this.esEdicion = true;
    this.mostrarFormularioEdicion = true;
  }

  // Método para guardar (crear o actualizar) una cuenta contable
  guardarCuentaContable(): void {
    if (this.esEdicion) {
      this.cuentasContables = this.cuentasContablesService.actualizarCuentaContable(
        this.cuentaContableSeleccionada
      );
    } else {
      this.cuentasContables = this.cuentasContablesService.agregarCuentaContable(
        this.cuentaContableSeleccionada
      );
    }
    this.actualizarListaCuentasContables();
    this.mostrarFormularioEdicion = false;
    this.cuentaContableSeleccionada = null; // Limpiar el formulario
  }

  // Método para cancelar la edición
  cancelarEdicion(): void {
    this.mostrarFormularioEdicion = false;
    this.cuentaContableSeleccionada = null;
  }

  // Método para abrir el modal de eliminación
  abrirModalEliminar(cuenta: any): void {
    this.cuentaContableAEliminar = cuenta;
    this.mostrarModalEliminar = true;
  }

  // Método para cerrar el modal de eliminación
  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.cuentaContableAEliminar = null;
  }

  // Método para eliminar una cuenta contable
  eliminarCuentaContable(): void {
    if (this.cuentaContableAEliminar) {
      this.cuentasContables = this.cuentasContablesService.eliminarCuentaContable(
        this.cuentaContableAEliminar.codigo
      );
      this.actualizarListaCuentasContables();
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

  // Método para verificar si la opción está activa
  isActive(option: string): boolean {
    return this.router.url.includes(this.menuRoutes[option]);
  }
}

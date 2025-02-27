import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoProveedoresService } from '../../services/proveedores_services/tipo-proveedores.service';

@Component({
  selector: 'app-tipos-proveedores',
  standalone: true,
  templateUrl: './tipos-proveedores.component.html',
  styleUrls: ['./tipos-proveedores.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class TiposProveedoresComponent implements OnInit {
  // Variables de la aplicación
  tiposProveedores: any[] = []; // Lista de tipos de proveedores
  tiposProveedoresFiltrados: any[] = []; // Lista filtrada para búsquedas
  searchValue: string = ''; // Valor de búsqueda
  Math = Math; // Para usar Math en la plantilla

  // Variables para la edición y eliminación
  mostrarFormularioEdicion: boolean = false; // Mostrar/ocultar formulario
  mostrarModalEliminar: boolean = false; // Mostrar/ocultar modal de eliminación
  tipoProveedorSeleccionado: any = null; // Tipo de proveedor seleccionado para edición
  tipoProveedorAEliminar: any = null; // Tipo de proveedor seleccionado para eliminación
  esEdicion: boolean = false; // Indica si estamos editando o creando

  // Variables para la paginación
  paginaActual: number = 1; // Página actual
  itemsPorPagina: number = 10; // Ítems por página
  totalRegistros: number = 0; // Total de registros

  // Variables para el menú de administración
  isAdminMenuCollapsed: boolean = false; // Menú colapsable

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
    'Tipos de proveedores': 'tipo-proveedor',
    'Tarifas por Grupo': 'tarifas-por-grupo'
  };


  constructor(
    private router: Router,
    private tipoProveedoresService: TipoProveedoresService
  ) {}

  ngOnInit(): void {
    this.cargarTiposProveedores(); // Cargar datos al iniciar
  }

  // Método para cargar los tipos de proveedores
  cargarTiposProveedores(): void {
    this.tiposProveedores = this.tipoProveedoresService.getTiposProveedores();
    this.actualizarListaTiposProveedores();
  }

  // Método para filtrar la lista de tipos de proveedores
  actualizarListaTiposProveedores(): void {
    this.tiposProveedoresFiltrados = this.tiposProveedores.filter(
      (tipo) =>
        tipo.tipo.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        tipo.descripcion.toLowerCase().includes(this.searchValue.toLowerCase())
    );
    this.totalRegistros = this.tiposProveedoresFiltrados.length;
  }

  // Método para abrir el formulario de agregar
  agregarTipoProveedor(): void {
    this.tipoProveedorSeleccionado = {
      tipo: '',
      descripcion: '',
    };
    this.esEdicion = false;
    this.mostrarFormularioEdicion = true;
  }

  // Método para abrir el formulario de edición
  editarTipoProveedor(tipo: any): void {
    this.tipoProveedorSeleccionado = { ...tipo };
    this.esEdicion = true;
    this.mostrarFormularioEdicion = true;
  }

  // Método para guardar (crear o actualizar) un tipo de proveedor
  guardarTipoProveedor(): void {
    if (this.esEdicion) {
      this.tiposProveedores =
        this.tipoProveedoresService.actualizarTipoProveedor(
          this.tipoProveedorSeleccionado
        );
    } else {
      this.tiposProveedores = this.tipoProveedoresService.agregarTipoProveedor(
        this.tipoProveedorSeleccionado
      );
    }
    this.actualizarListaTiposProveedores();
    this.mostrarFormularioEdicion = false;
  }

  // Método para cancelar la edición
  cancelarEdicion(): void {
    this.mostrarFormularioEdicion = false;
    this.tipoProveedorSeleccionado = null;
  }

  // Método para abrir el modal de eliminación
  abrirModalEliminar(tipo: any): void {
    this.tipoProveedorAEliminar = tipo;
    this.mostrarModalEliminar = true;
  }

  // Método para cerrar el modal de eliminación
  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.tipoProveedorAEliminar = null;
  }

  // Método para eliminar un tipo de proveedor
  eliminarTipoProveedor(): void {
    if (this.tipoProveedorAEliminar) {
      this.tiposProveedores = this.tipoProveedoresService.eliminarTipoProveedor(
        this.tipoProveedorAEliminar.tipo
      );
      this.actualizarListaTiposProveedores();
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanCuentasService } from '../../services/plan-cuentas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-plan-cuentas',
  standalone: true,
  templateUrl: './plan-cuentas.component.html',
  styleUrls: ['./plan-cuentas.component.css'],
  imports: [CommonModule, FormsModule],
})
export class PlanCuentasComponent implements OnInit {
  // Variables para el formulario
  mostrarFormulario: boolean = false;
  planCuentaSeleccionado: any = null;
  esEdicion: boolean = false;

  // Variables para la tabla
  planesCuentas: any[] = [];
  planesCuentasFiltrados: any[] = [];
  searchValue: string = '';

  // Variables para la paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  totalRegistros: number = 0;

  // Variables para el modal de eliminación
  mostrarModalEliminar: boolean = false;
  cuentaAEliminar: any = null;

  // Opciones dinámicas
  tiposCuenta: string[] = ['Activo', 'Pasivo', 'Patrimonio', 'Ingresos', 'Gastos'];
  cuentasPadre: any[] = [];

  // Variables para el menú de administración
  isAdminMenuCollapsed: boolean = false;
  Math = Math;

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
    'Plan-Cuentas': 'Plan-Cuentas',
  };

  constructor(
    private router: Router,
    private planCuentasService: PlanCuentasService
  ) {}

  ngOnInit(): void {
    this.cargarPlanesCuentas();
    this.cargarOpcionesDinamicas();
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

  exportarExcel(): void {
    let tabla = document.querySelector('table'); // Asumiendo que la tabla está en el HTML
    let ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tabla);
    let wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');

    XLSX.writeFile(wb, 'productos.xlsx');
  }

  // Cargar datos iniciales
  cargarPlanesCuentas(): void {
    this.planesCuentas = this.planCuentasService.getPlanesCuentas();
    this.actualizarListaPlanesCuentas();
  }

  // Cargar opciones dinámicas
  cargarOpcionesDinamicas(): void {
    this.cuentasPadre = this.planCuentasService.getCuentasPadre();
  }

  // Filtrar la lista de planes de cuentas
  actualizarListaPlanesCuentas(): void {
    this.planesCuentasFiltrados = this.planesCuentas.filter(
      (plan) =>
        plan.codigo.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        plan.nombre.toLowerCase().includes(this.searchValue.toLowerCase())
    );
    this.totalRegistros = this.planesCuentasFiltrados.length;
  }

  // Abrir formulario para agregar
  agregarPlanCuenta(): void {
    this.planCuentaSeleccionado = {
      codigo: 'PC001', // Código predeterminado
      nombre: '',
      seccion: '',
      formula: '',
      tipo: '',
      parent: '',
      visible: true,
      detalle: false,
    };
    this.esEdicion = false;
    this.mostrarFormulario = true;
  }

  // Abrir formulario para editar
  editarPlanCuenta(plan: any): void {
    this.planCuentaSeleccionado = { ...plan };
    this.esEdicion = true;
    this.mostrarFormulario = true;
  }

  // Guardar (crear o actualizar) un plan de cuentas
  guardarPlanCuenta(): void {
    if (this.esEdicion) {
      this.planesCuentas = this.planCuentasService.actualizarPlanCuenta(
        this.planCuentaSeleccionado
      );
    } else {
      this.planesCuentas = this.planCuentasService.agregarPlanCuenta(
        this.planCuentaSeleccionado
      );
    }
    this.actualizarListaPlanesCuentas();
    this.mostrarFormulario = false;
    this.planCuentaSeleccionado = null;
  }

  // Cancelar edición
  cancelarEdicion(): void {
    this.mostrarFormulario = false;
    this.planCuentaSeleccionado = null;
  }

  // Abrir modal de eliminación
  abrirModalEliminar(codigo: string): void {
    this.cuentaAEliminar = this.planesCuentas.find((plan) => plan.codigo === codigo);
    this.mostrarModalEliminar = true;
  }

  // Cerrar modal de eliminación
  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.cuentaAEliminar = null;
  }

  // Eliminar un plan de cuentas
  eliminarPlanCuenta(): void {
    if (this.cuentaAEliminar) {
      this.planesCuentas = this.planCuentasService.eliminarPlanCuenta(this.cuentaAEliminar.codigo);
      this.actualizarListaPlanesCuentas();
      this.cerrarModalEliminar();
    }
  }

  // Cambiar de página
  cambiarPagina(pagina: number): void {
    if (
      pagina >= 1 &&
      pagina <= Math.ceil(this.totalRegistros / this.itemsPorPagina)
    ) {
      this.paginaActual = pagina;
    }
  }

  //metodo para saber donde estamos en el segundo menú
  // Método para verificar si la opción está activa
  isActive(option: string): boolean {
    return this.router.url.includes(option);
  }
}
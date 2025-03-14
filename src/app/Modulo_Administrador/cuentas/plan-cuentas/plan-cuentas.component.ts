import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanCuentasService } from '../../../services/plan-cuentas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuRoutesService } from '../../../services/servicios_compartidos/menu-routes.service';
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
  planesCuentasPaginados: any[] = []; // Lista paginada
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

  Math = Math;

  // Diccionario de opciones con sus respectivas rutas
  menuRoutes: { [key: string]: string } = {};

  constructor(
    private router: Router,
    private planCuentasService: PlanCuentasService,
    private menuRoutesService: MenuRoutesService
  ) {}

  ngOnInit(): void {
    // Obtener las rutas del menú desde el servicio
    this.menuRoutes = this.menuRoutesService.getMenuRoutes();
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

  // Exportar a Excel
  exportarExcel(): void {
    let tabla = document.querySelector('table'); // Asumiendo que la tabla está en el HTML
    let ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tabla);
    let wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PlanCuentas');
    XLSX.writeFile(wb, 'plan-cuentas.xlsx');
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
    this.paginaActual = 1; // Reiniciar a la primera página
    this.actualizarPaginacion(); // Actualizar la lista paginada
  }

  // Actualizar la lista paginada
  actualizarPaginacion(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.planesCuentasPaginados = this.planesCuentasFiltrados.slice(inicio, fin);
  }

  // Cambiar de página
  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= Math.ceil(this.totalRegistros / this.itemsPorPagina)) {
      this.paginaActual = pagina;
      this.actualizarPaginacion();
    }
  }

  // Cambiar la cantidad de ítems por página
  cambiarItemsPorPagina(cantidad: number | string): void {
    if (cantidad === 'todos') {
      this.itemsPorPagina = this.totalRegistros; // Mostrar todos los registros
    } else {
      this.itemsPorPagina = Number(cantidad); // Convertir a número y asignar
    }
    this.paginaActual = 1; // Reiniciar a la primera página
    this.actualizarPaginacion();
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

  // Método para verificar si la opción está activa
  isActive(option: string): boolean {
    return this.router.url.includes(this.menuRoutes[option]);
  }
}
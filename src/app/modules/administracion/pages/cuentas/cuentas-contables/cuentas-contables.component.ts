import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CuentasContablesService } from '../../../services/Cuentas_services/cuentas-contables.service';
import { MenuRoutesService } from '../../../services/servicios_compartidos/menu-routes.service'; // Importar el servicio

@Component({
  selector: 'app-cuentas-contables',
  standalone: true,
  templateUrl: './cuentas-contables.component.html',
  styleUrls: ['./cuentas-contables.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class CuentasContablesComponent{
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
}

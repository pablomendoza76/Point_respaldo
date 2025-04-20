import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuRoutesService {
  menuRoutes: { [key: string]: string } = {
    // Administración
    Administración: 'administrador',
    Configuración: 'configuracion',
    Empresa: 'empresa',

    // Proveedores
    Proveedores: 'proveedores/gestion-proveedores',
    Proveedores_vista: 'proveedores/gestion-proveedores',
    'Tipos de proveedores': 'proveedores/tipo-proveedor',

    // Tipos PVP
	'Tipos PVP': 'tipos-pvp',
    'Tipos_PVP_vista': 'tipos-pvp/precios',
    Precios: 'tipos-pvp/precios',

    // Clientes
    Clientes: 'clientes',
    Clientes_vista: 'clientes/clientes-general',
    'Tipos de clientes': 'clientes/tipo-cliente',

    // Cuentas Contables
    Cuentas_Contables: 'cuentas',
    'Cuentas_vista': 'cuentas/cuentas-contables',
    'Plan-Cuentas': 'cuentas/Plan-Cuentas',

    // Productos
    'Productos': 'productos', // Ruta padre corregida
    'Vista General': 'productos/vista-general', // Ruta hija
    'Marcas': 'productos/marcas', // Ruta hija
    'Tipos de Productos': 'productos/tipos-productos', // Ruta hija
    'Tarifas por Grupo': 'productos/tarifas-por-grupo', // Ruta hija

    // Importar
    Importar: 'importar',
  };

  constructor() {}

  getMenuRoutes() {
    return this.menuRoutes;
  }
}

import { MenuItem } from './componentes_reutilizables/dynamic-menu/dynamic-menu.component';

/**
 * Estructura de menú principal y submódulos del sistema.
 * Esta configuración puede ser usada para alimentar menús dinámicos.
 */
export const MENU_CONFIG: {
  principales: MenuItem[],
  hijos: { [modulo: string]: MenuItem[] }
} = {
  principales: [
    { label: 'Productos', icon: 'fas fa-box' },
    { label: 'Clientes', icon: 'fas fa-users' },
    { label: 'Proveedores', icon: 'fas fa-truck' },
    { label: 'Cuentas', icon: 'fas fa-coins' },
    { label: 'Empresa', icon: 'fas fa-building', route: 'empresa' },
    { label: 'Configuración', icon: 'fas fa-gear', route: 'configuracion' },
    { label: 'Importar', icon: 'fas fa-file-import', route: 'importar' }
  ],

  hijos: {
    Productos: [
      { label: 'Gestión de Productos', icon: 'fas fa-eye', route: 'productos/vista-general' },
      { label: 'Marcas', icon: 'fas fa-tags', route: 'productos/marcas' },
      { label: 'Tipos de Productos', icon: 'fas fa-boxes', route: 'productos/tipos-productos' },
      { label: 'Tarifas por Grupo', icon: 'fas fa-percent', route: 'productos/tarifas-por-grupo' },
    ],
    Clientes: [
      { label: 'Clientes General', icon: 'fas fa-user', route: 'clientes/clientes-general' },
      { label: 'Tipos de Clientes', icon: 'fas fa-id-badge', route: 'clientes/tipo-cliente' }
    ],
    Proveedores: [
      { label: 'Gestión Proveedores', icon: 'fas fa-truck-front', route: 'proveedores/gestion-proveedores' },
      { label: 'Tipos de Proveedores', icon: 'fas fa-clipboard-check', route: 'proveedores/tipo-proveedor' }
    ],
    Cuentas: [
      { label: 'Cuentas Contables', icon: 'fas fa-coins', route: 'cuentas/cuentas-contables' },
      { label: 'Plan Cuentas', icon: 'fas fa-sitemap', route: 'cuentas/plan-cuentas' }
    ],
  }
};

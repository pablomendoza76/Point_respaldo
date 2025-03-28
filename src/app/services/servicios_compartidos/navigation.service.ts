import { Injectable } from '@angular/core';

interface BusinessStat {
  value: number;
  icon: string;
  label: string;
}

interface Module {
  name: string;
  selected: boolean;
}

interface ModuleGroup {
  category: string;
  modules: Module[];
}

interface Notification {
  title: string;
  description: string;
  date: string;
  type: string;
}

interface NotificationGroup {
  category: string;
  notifications: Notification[];
}

interface WelcomeData {
  userName: string;
  searchPlaceholder: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor() { }

  getBusinessStats(): Record<string, BusinessStat> {
    return {
      ventas: { value: 12540, icon: '💰', label: 'Ventas Hoy' },
      clientes: { value: 324, icon: '👥', label: 'Clientes Nuevos' },
      productos: { value: 856, icon: '🛒', label: 'Productos Vendidos' },
      pedidos: { value: 42, icon: '📦', label: 'Pedidos Pendientes' }
    };
  }

  getSalesData(): any[] {
    return [
      { month: 'Ene', value: 150 },
      { month: 'Feb', value: 180 },
      { month: 'Mar', value: 210 },
      { month: 'Abr', value: 190 },
      { month: 'May', value: 230 },
      { month: 'Jun', value: 260 }
    ];
  }

  getTopProducts(): any[] {
    return [
      { name: 'Arroz', units: 120, total: 360 },
      { name: 'Aceite', units: 85, total: 425 },
      { name: 'Azúcar', units: 75, total: 225 },
      { name: 'Leche', units: 65, total: 195 }
    ];
  }

  getNotifications(): Notification[] {
    return [
      {
        title: 'Nueva actualización disponible',
        description: 'Versión 2.3.0 está lista para instalar',
        date: new Date().toISOString(),
        type: 'info'
      },
      {
        title: 'Problema con el servidor',
        description: 'Se detectaron problemas de conexión',
        date: new Date(Date.now() - 86400000).toISOString(), // Ayer
        type: 'error'
      },
      {
        title: 'Tarea completada',
        description: 'El proceso de backup se completó con éxito',
        date: new Date(Date.now() - 172800000).toISOString(), // Hace 2 días
        type: 'success'
      }
    ];
  }

  getWelcomeData(): WelcomeData {
    return {
      userName: 'Administrador',
      searchPlaceholder: 'Buscar módulos...'
    };
  }

  getGroupedModules(): ModuleGroup[] {
    return [
      {
        category: 'Administración y Control',
        modules: [
          { name: 'Administración', selected: false },
          { name: 'Créditos', selected: false },
          { name: 'Contratos', selected: false },
          { name: 'Control de…', selected: false },
          { name: 'Reposiciones', selected: false },
          { name: 'Caja', selected: false },
          { name: 'C x P', selected: false },
          { name: 'C x C', selected: false },
        ],
      },
      {
        category: 'Gestión de Ventas',
        modules: [
          { name: 'Facturación', selected: false },
          { name: 'Ventas', selected: false },
          { name: 'Cupones', selected: false },
          { name: 'Cotizaciones', selected: false },
        ],
      },
      {
        category: 'Logística y Soporte',
        modules: [
          { name: 'Servicio técnico', selected: false },
          { name: 'Autoservicio', selected: false },
          { name: 'Verificador…', selected: false },
          { name: 'Inventarios', selected: false },
          { name: 'Compras (…)', selected: false },
          { name: 'Encomiendas', selected: true },
        ],
      },
      {
        category: 'Operaciones y Producción',
        modules: [
          { name: 'Producción', selected: false },
          { name: 'Notas de entrega', selected: false },
          { name: 'Manejo de…', selected: false },
          { name: 'Reporte ATS', selected: false },
        ],
      },
      {
        category: 'Comunicación y Gestión',
        modules: [
          { name: 'Agenda', selected: false },
          { name: 'Reuniones', selected: false },
          { name: 'Reportes', selected: false },
          { name: 'Mensajería', selected: true },
        ],
      },
      {
        category: 'Finanzas',
        modules: [
          { name: 'Nómina', selected: false },
          { name: 'Contabilidad', selected: false },
          { name: 'Bancos', selected: false },
        ],
      },
      {
        category: 'Servicios',
        modules: [
          { name: 'Restaurante', selected: false },
          { name: 'Parking', selected: false },
          { name: 'Hoteles', selected: false },
          { name: 'Veterinaria', selected: false },
          { name: 'Talleres', selected: false },
          { name: 'Tienda en Línea', selected: true },
        ],
      },
    ];
  }
}
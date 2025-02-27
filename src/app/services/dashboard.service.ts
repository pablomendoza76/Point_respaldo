import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor() {}

  // Método para obtener los datos de bienvenida
  getWelcomeData() {
    return {
      userName: 'pablo',
      searchPlaceholder: 'Buscar módulo',
      searchLabel: '¿Qué módulo estás buscando?',
    };
  }

  // Métodos existentes
  getBusinessStats() {
    return {
      gananciasTotales: { value: 12000, icon: "💵", label: "Ganancias Totales" },
      ventasTotales: { value: 5000, icon: "💰", label: "Ventas Totales" },
      inventarioActual: { value: 800, icon: "📦", label: "Inventario Disponible" },
      ordenesProcesadas: { value: 150, icon: "🛒", label: "Órdenes Procesadas" }
    };
  }

  getSalesData() {
    return [
      { month: 'Ene', value: 3 },
      { month: 'Feb', value: 5 },
      { month: 'Mar', value: 6 },
      { month: 'Abr', value: 1 },
      { month: 'May', value: 4 },
      { month: 'Jun', value: 7 },
      { month: 'Jul', value: 3 },
      { month: 'Ago', value: 6 },
      { month: 'Sep', value: 2 },
      { month: 'Oct', value: 1 },
      { month: 'Nov', value: 4 },
      { month: 'Dic', value: 5 }
    ];
  }

  getTopProducts() {
    return [
      { name: 'Producto A', units: 120, total: 2400 },
      { name: 'Producto B', units: 95, total: 1900 },
      { name: 'Producto C', units: 80, total: 1600 },
      { name: 'Producto D', units: 54, total: 165 }
    ];
  }

  getNotifications() {
    return [
      { title: 'Stock crítico en inventario', description: '120 productos en niveles críticos.', date: '19, dic 10:30 AM', type: 'warning' },
      { title: 'Producto sin stock', description: 'El producto "Camiseta blanca" está agotado.', date: '19, dic 10:30 AM', type: 'error' },
      { title: 'Promoción Navideña', description: 'Descuento en la compra de comprobantes.', date: '19, dic 10:30 AM', type: 'info' }
    ];
  }
}
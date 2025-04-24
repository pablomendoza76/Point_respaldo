import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { BusinessStat } from '../Interfaces/billing-sof-admin/adminDashboard'

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
      gananciasTotales: { value: 12000, icon: 'fa-dollar-sign text-blue-500', label: 'Ganancias - Hoy' },
      ventasTotales: { value: 5000, icon: 'fa-bag-shopping text-yellow-500', label: 'Ventas - Del día' },
      inventarioActual: { value: 800, icon: 'fa-box-archive text-green-500', label: 'Inventario - Total' },
      ordenesProcesadas: { value: 150, icon: 'fa-file text-red-500', label: 'Ordenes - Principal' },
    }
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
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);
  
    return [
      { 
        title: 'Stock crítico en inventario', 
        description: '120 productos en niveles críticos.', 
        date: today.toISOString(), // Fecha en formato ISO
        type: 'warning' 
      },
      { 
        title: 'Producto sin stock', 
        description: 'El producto "Camiseta blanca" está agotado.', 
        date: yesterday.toISOString(), // Fecha en formato ISO
        type: 'error' 
      },
      { 
        title: 'Notificación antigua', 
        description: 'Esta es una notificación de hace más de dos días.', 
        date: '2023-12-15T10:30:00', // Fecha en formato ISO
        type: 'info' 
      }
    ];
  }
}

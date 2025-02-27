import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { DashboardService } from '../services/dashboard.service';
import { Chart } from 'chart.js/auto';

interface BusinessStat {
  value: number;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-billing-sof-admin',
  standalone: true,
  templateUrl: './billing-sof-admin.component.html',
  styleUrls: ['./billing-sof-admin.component.css'],
  imports: [CommonModule, RouterModule],
})
export class BillingSofAdminComponent implements OnInit, AfterViewInit {
  businessStats: Record<string, BusinessStat> = {};
  salesData: any[] = [];
  topProducts: any[] = [];
  notifications: any[] = [];
  menuOptions: string[] = [
    'Administración', 'Restaurante', 'Ventas', 'Facturación Electrónica', 'Compras (Gastos diarios)',
    'Caja', 'CxP', 'CxC', 'Créditos', 'Contratos', 'Control de Personal', 'Reposiciones', 'Cupones',
    'Cotizaciones', 'Servicio técnico', 'Encomiendas', 'Autoservicio', 'Verificador de Precios', 'Inventarios',
    'Producción', 'Notas de entrega', 'Manejo de Activos', 'Reporte ATS', 'Agenda', 'Reuniones', 'Mensajería',
    'Reportes', 'Nómina', 'Contabilidad', 'Bancos', 'Parking', 'Tienda en Línea', 'Hoteles', 'Veterinaria', 'Talleres'
  ];

  // Datos de bienvenida
  welcomeData: any = {};

  constructor(private dashboardService: DashboardService, private router: Router) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadWelcomeData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createSalesChart();
      this.createRadarChart();
    }, 500);
  }

  loadDashboardData(): void {
    this.businessStats = this.dashboardService.getBusinessStats();
    this.salesData = this.dashboardService.getSalesData();
    this.topProducts = this.dashboardService.getTopProducts();
    this.notifications = this.dashboardService.getNotifications();
  }

  // Método para cargar los datos de bienvenida
  loadWelcomeData(): void {
    this.welcomeData = this.dashboardService.getWelcomeData();
  }

  createSalesChart(): void {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.salesData.map(data => data.month),
          datasets: [{
            label: 'Clientes Nuevos',
            data: this.salesData.map(data => data.value),
            backgroundColor: 'rgba(0, 204, 153, 0.5)',
            borderColor: 'rgba(0, 204, 153, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }
  }

  createRadarChart(): void {
    const ctx = document.getElementById('radarChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Nike', 'Favorita', 'Pronaca', 'Electric', 'Genérica'],
          datasets: [{
            label: 'Marcas más Vendidas',
            data: [8, 7, 6, 9, 7],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          scales: {
            r: {
              angleLines: { display: true },
              suggestedMin: 0,
              suggestedMax: 10
            }
          }
        }
      });
    }
  }

  // Método para redireccionar cuando se haga clic en "Administración"
  navigateTo(option: string): void {
    if (option === 'Administración') {
      this.router.navigate(['/productos']);
    }
  }
}

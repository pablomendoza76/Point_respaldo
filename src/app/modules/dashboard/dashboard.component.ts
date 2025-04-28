import { CommonModule } from '@angular/common'
import { AfterViewInit, Component, computed, OnInit, signal } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { BusinessStat, Module, ModuleGroup, Notification, NotificationGroup, TopProduct } from '@modules/administracion/Interfaces/billing-sof-admin/adminDashboard'
import { DashboardService } from '@modules/administracion/services/dashboard.service'
import { Chart } from 'chart.js/auto'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  businessStats = signal<Record<string, BusinessStat>>({})
  notifications = signal<Notification[]>([])
  notificationGroups = signal<NotificationGroup[]>([])
  salesData = signal<any[]>([])
  searchQuery = signal<string>('')
  topProducts = signal<TopProduct[]>([])
  floatingMenuOpen = signal<boolean>(false)
  notificationsPopupOpen = signal<boolean>(false)
  sidebarOpen = signal<boolean>(false)
  supportPopupOpen = signal<boolean>(false)

  groupedModules: ModuleGroup[] = [
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
  ]

  allModules: Module[] = this.groupedModules.flatMap((group) => group.modules)
  filteredModules = computed(() => (this.searchQuery() ? this.allModules.filter((m) => m.name.toLowerCase().includes(this.searchQuery())) : this.allModules))

  constructor(private dashboardService: DashboardService, private router: Router) {}

  ngOnInit(): void {
    this.loadDashboardData()
    this.groupNotificationsByDate()
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createSalesChart()
      this.createRadarChart()
    }, 500)
  }

  toggleFloatingMenu() {
    this.floatingMenuOpen.update((prev) => !prev)
  }

  toggleNotificationsPopup() {
    this.notificationsPopupOpen.update((prev) => !prev)
  }

  toggleSidebar() {
    this.sidebarOpen.update((prev) => !prev)
  }

  toggleSupportPopup() {
    this.supportPopupOpen.update((prev) => !prev)
  }

  loadDashboardData(): void {
    this.businessStats.set(this.dashboardService.getBusinessStats())
    this.salesData.set(this.dashboardService.getSalesData())
    this.topProducts.set(this.dashboardService.getTopProducts())
    this.notifications.set(this.dashboardService.getNotifications())
  }

  createSalesChart(): void {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.salesData().map((data) => data.month),
          datasets: [
            {
              label: 'Clientes Nuevos',
              data: this.salesData().map((data) => data.value),
              backgroundColor: 'rgb(39, 218, 203)',
              barThickness: 10,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      })
    }
  }

  createRadarChart(): void {
    const ctx = document.getElementById('radarChart') as HTMLCanvasElement
    if (ctx) {
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Nike', 'Favorita', 'Pronaca', 'Electric', 'Genérica'],
          datasets: [
            {
              label: 'Marcas más Vendidas',
              data: [8, 7, 6, 9, 7],
              backgroundColor: 'rgba(202, 253, 244, 0.2)',
              borderColor: 'rgba(14, 97, 94, 0.8)',
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            r: {
              angleLines: { display: true },
              suggestedMin: 0,
              suggestedMax: 10,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      })
    }
  }

  navigateTo(option: string): void {
    const MODULE_ROUTES: Record<string, string> = {
      Administración: 'administracion/productos',
      Créditos: 'creditos',
      Contratos: 'contratos',
      'Control de…': 'control',
      Reposiciones: 'reposiciones',
      Caja: 'caja',
      'C x P': 'cxp',
      'C x C': 'cxc',
      Facturación: 'facturacion',
      Ventas: 'ventas',
      Cupones: 'cupones',
      Cotizaciones: 'cotizaciones',
      'Servicio técnico': 'servicio-tecnico',
      Autoservicio: 'autoservicio',
      'Verificador…': 'verificador',
      Inventarios: 'inventarios',
      'Compras (…)': 'compras',
      Encomiendas: 'encomiendas',
      Producción: 'produccion',
      'Notas de entrega': 'notas-entrega',
      'Manejo de…': 'manejo-activos',
      'Reporte ATS': 'reporte-ats',
      Agenda: 'agenda',
      Reuniones: 'reuniones',
      Reportes: 'reportes',
      Mensajería: 'mensajeria',
      Nómina: 'nomina',
      Contabilidad: 'contabilidad',
      Bancos: 'bancos',
      Restaurante: 'restaurante',
      Parking: 'parking',
      Hoteles: 'hoteles',
      Veterinaria: 'veterinaria',
      Talleres: 'talleres',
      'Tienda en Línea': 'tienda-en-linea',
    }

    const path = MODULE_ROUTES[option]
    if (path) this.router.navigate(['dashboard', ...path.split('/')])
  }

  getModuleIcon(moduleName: string): string {
    const icons: { [key: string]: string } = {
      Administración: 'fa-cogs',
      Créditos: 'fa-credit-card',
      Contratos: 'fa-file-contract',
      'Control de…': 'fa-users',
      Reposiciones: 'fa-boxes',
      Caja: 'fa-cash-register',
      'C x P': 'fa-hand-holding-usd',
      'C x C': 'fa-handshake',
      Facturación: 'fa-file-invoice',
      Ventas: 'fa-shopping-cart',
      Cupones: 'fa-tags',
      Cotizaciones: 'fa-file-alt',
      'Servicio técnico': 'fa-tools',
      Autoservicio: 'fa-user-cog',
      'Verificador…': 'fa-barcode',
      Inventarios: 'fa-box-open',
      'Compras (…)': 'fa-shopping-basket',
      Encomiendas: 'fa-truck',
      Producción: 'fa-industry',
      'Notas de entrega': 'fa-clipboard-list',
      'Manejo de…': 'fa-building',
      'Reporte ATS': 'fa-file-excel',
      Agenda: 'fa-calendar-alt',
      Reuniones: 'fa-users',
      Reportes: 'fa-chart-bar',
      Mensajería: 'fa-envelope',
      Nómina: 'fa-money-check-alt',
      Contabilidad: 'fa-balance-scale',
      Bancos: 'fa-university',
      Restaurante: 'fa-utensils',
      Parking: 'fa-parking',
      Hoteles: 'fa-hotel',
      Veterinaria: 'fa-paw',
      Talleres: 'fa-wrench',
      'Tienda en Línea': 'fa-store',
    }
    return `fa-solid ${icons[moduleName]}`
  }

  highlightModule(module: Module): void {
    module.selected = true
  }

  unhighlightModule(module: Module): void {
    module.selected = false
  }

  groupNotificationsByDate(): void {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    const twoDaysAgo = new Date(today)
    twoDaysAgo.setDate(today.getDate() - 2)

    const formatDateForComparison = (date: Date): string => {
      return date.toISOString().split('T')[0]
    }

    const todayNotifications = this.notifications().filter((notification) => {
      const notificationDate = new Date(notification.date)
      return formatDateForComparison(notificationDate) === formatDateForComparison(today)
    })

    const yesterdayNotifications = this.notifications().filter((notification) => {
      const notificationDate = new Date(notification.date)
      return formatDateForComparison(notificationDate) === formatDateForComparison(yesterday)
    })

    const olderNotifications = this.notifications().filter((notification) => {
      const notificationDate = new Date(notification.date)
      return formatDateForComparison(notificationDate) < formatDateForComparison(twoDaysAgo)
    })

    this.notificationGroups.set([
      { category: 'Hoy', notifications: todayNotifications },
      { category: 'Ayer', notifications: yesterdayNotifications },
      { category: 'Hace más de dos días', notifications: olderNotifications },
    ])
  }

  getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      info: 'fas fa-info-circle text-blue-500',
      warning: 'fas fa-exclamation-triangle text-yellow-500',
      error: 'fas fa-times-circle text-red-500',
      success: 'fas fa-check-circle text-green-500',
    }

    return icons[type] || 'fas fa-bell text-gray-500'
  }

  getIconContainerColor(iconColor: string): string {
    const decoponsition = iconColor.split('-')
    const lowerOpacity = `${decoponsition[2][0]}0`

    return `bg-${decoponsition[1]}-${lowerOpacity}`
  }

  openMessenger(): void {
    const messengerUrl = 'https://m.me/tu_pagina_de_facebook'
    window.open(messengerUrl, '_blank')
  }

  openTelegram(): void {
    const telegramUrl = 'https://t.me/tu_usuario_de_telegram'
    window.open(telegramUrl, '_blank')
  }

  openSMS(): void {
    const phoneNumber = '0963319244'
    const smsUrl = `sms:${phoneNumber}`
    window.location.href = smsUrl
  }
}

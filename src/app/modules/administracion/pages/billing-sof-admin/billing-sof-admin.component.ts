import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, signal } from '@angular/core'
import { Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { DashboardService } from '../../services/dashboard.service'
import { Chart } from 'chart.js/auto'

interface BusinessStat {
  value: number
  icon: string
  label: string
}

interface Module {
  name: string
  selected: boolean
}

interface ModuleGroup {
  category: string
  modules: Module[]
}

interface Notification {
  title: string
  description: string
  date: string
  type: string
}

interface NotificationGroup {
  category: string
  notifications: Notification[]
}

interface TopProduct {
  name: string
  units: number
  total: number
}

@Component({
  selector: 'app-billing-sof-admin',
  standalone: true,
  templateUrl: './billing-sof-admin.component.html',
  styleUrls: ['./billing-sof-admin.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class BillingSofAdminComponent implements OnInit, AfterViewInit {
  @ViewChild('notificationsToggle') notificationsToggle!: ElementRef
  @ViewChild('notificationsPopup') notificationsPopup!: ElementRef
  @ViewChild('supportToggle') supportToggle!: ElementRef
  @ViewChild('supportPopup') supportPopup!: ElementRef
  @ViewChild('menuToggle') menuToggle!: ElementRef // Referencia al ícono del menú flotante
  @ViewChild('floatingMenu') floatingMenu!: ElementRef // Referencia al popup del menú flotante
  @ViewChild('sideMenu') sideMenu!: ElementRef // Referencia al menú lateral
  @ViewChild('content') content!: ElementRef // Referencia al contenido principal
  @ViewChild('toggleMenu') toggleMenu!: ElementRef // Referencia al ícono de expansión del menú lateral

  businessStats = signal<Record<string, BusinessStat>>({})
  salesData: any[] = []
  topProducts = signal<TopProduct[]>([])
  notifications: Notification[] = []
  notificationGroups: NotificationGroup[] = []
  isMenuExpanded = false // Estado del menú lateral
  isSidebarExpanded = signal<boolean>(false)

  filteredModules = signal<Module[]>([]) // Módulos filtrados
  searchQuery = signal<string>('') //

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
  welcomeData: any = {}

  constructor(private dashboardService: DashboardService, private router: Router) {}

  ngOnInit(): void {
    this.loadDashboardData()
    this.loadWelcomeData()
    this.groupNotificationsByDate()
    this.filteredModules.set(this.allModules)
  }

  ngAfterViewInit(): void {
    this.setupMenuToggle() // Configurar el evento del menú flotante
    this.setupToggleMenu() // Configurar el evento del botón de expansión del menú lateral
    this.setupNotificationsToggle()
    this.setupSupportToggle()
    setTimeout(() => {
      this.createSalesChart()
      this.createRadarChart()
    }, 500)
  }

  loadDashboardData(): void {
    this.businessStats.set(this.dashboardService.getBusinessStats())
    this.salesData = this.dashboardService.getSalesData()
    this.topProducts.set(this.dashboardService.getTopProducts())
    this.notifications = this.dashboardService.getNotifications()
  }

  loadWelcomeData(): void {
    this.welcomeData = this.dashboardService.getWelcomeData()
  }

  toggleModulesSidebar() {
    this.isSidebarExpanded.update((val) => !val)
  }

  createSalesChart(): void {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.salesData.map((data) => data.month),
          datasets: [
            {
              label: 'Clientes Nuevos',
              data: this.salesData.map((data) => data.value),
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
    const routes: { [key: string]: string } = {
      Administración: '/productos/vista-general',
      Créditos: '/creditos',
      Contratos: '/contratos',
      'Control de…': '/control',
      Reposiciones: '/reposiciones',
      Caja: '/caja',
      'C x P': '/cxp',
      'C x C': '/cxc',
      Facturación: '/facturacion',
      Ventas: '/ventas',
      Cupones: '/cupones',
      Cotizaciones: '/cotizaciones',
      'Servicio técnico': '/servicio-tecnico',
      Autoservicio: '/autoservicio',
      'Verificador…': '/verificador',
      Inventarios: '/inventarios',
      'Compras (…)': '/compras',
      Encomiendas: '/encomiendas',
      Producción: '/produccion',
      'Notas de entrega': '/notas-entrega',
      'Manejo de…': '/manejo-activos',
      'Reporte ATS': '/reporte-ats',
      Agenda: '/agenda',
      Reuniones: '/reuniones',
      Reportes: '/reportes',
      Mensajería: '/mensajeria',
      Nómina: '/nomina',
      Contabilidad: '/contabilidad',
      Bancos: '/bancos',
      Restaurante: '/restaurante',
      Parking: '/parking',
      Hoteles: '/hoteles',
      Veterinaria: '/veterinaria',
      Talleres: '/talleres',
      'Tienda en Línea': '/tienda-en-linea',
    }

    const route = routes[option]
    if (route) {
      this.router.navigate([`dashboard/${route}`])
    } else {
      console.warn(`No se encontró una ruta para el módulo: ${option}`)
    }
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

  // Configura el evento del botón de expansión del menú lateral
  setupToggleMenu(): void {
    if (this.toggleMenu && this.sideMenu && this.content) {
      this.toggleMenu.nativeElement.addEventListener('click', () => {
        this.toggleMenuState()
      })
    }
  }

  // Expande o contrae el menú lateral
  toggleMenuState(): void {
    this.isMenuExpanded = !this.isMenuExpanded

    // Añade la clase `expanded`
    this.sideMenu.nativeElement.classList.toggle('expanded', this.isMenuExpanded)
    this.content.nativeElement.classList.toggle('expanded', this.isMenuExpanded)

    //se agrego para oculatar las seciones, y evitar que se sobre esciban los css
    const additionalData = document.querySelector('.additional-data') as HTMLElement
    if (additionalData) {
      additionalData.style.display = this.isMenuExpanded ? 'none' : 'block'
    }
  }

  // Configura el evento del botón del menú flotante
  setupMenuToggle(): void {
    if (this.menuToggle && this.floatingMenu) {
      this.menuToggle.nativeElement.addEventListener('click', () => {
        this.floatingMenu.nativeElement.classList.toggle('hidden')
      })
    }
  }

  setupNotificationsToggle(): void {
    if (this.notificationsToggle && this.notificationsPopup) {
      this.notificationsToggle.nativeElement.addEventListener('click', () => {
        this.notificationsPopup.nativeElement.classList.toggle('hidden')
      })
    }
  }

  setupSupportToggle(): void {
    if (this.supportToggle && this.supportPopup) {
      this.supportToggle.nativeElement.addEventListener('click', () => {
        this.supportPopup.nativeElement.classList.toggle('hidden')
      })
    }
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

    const todayNotifications = this.notifications.filter((notification) => {
      const notificationDate = new Date(notification.date)
      return formatDateForComparison(notificationDate) === formatDateForComparison(today)
    })

    const yesterdayNotifications = this.notifications.filter((notification) => {
      const notificationDate = new Date(notification.date)
      return formatDateForComparison(notificationDate) === formatDateForComparison(yesterday)
    })

    const olderNotifications = this.notifications.filter((notification) => {
      const notificationDate = new Date(notification.date)
      return formatDateForComparison(notificationDate) < formatDateForComparison(twoDaysAgo)
    })

    this.notificationGroups = [
      { category: 'Hoy', notifications: todayNotifications },
      { category: 'Ayer', notifications: yesterdayNotifications },
      { category: 'Hace más de dos días', notifications: olderNotifications },
    ]
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
    // console.log(`bg-${decoponsition[1]}-${lowerOpacity}`)

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

  // Función para filtrar módulos
  filterModules(event: Event): void {
    const inputElement = event.target as HTMLInputElement
    this.searchQuery.set(inputElement.value.toLowerCase()) // Convierte la consulta a minúsculas

    if (this.searchQuery()) {
      const newFilteredModules = this.allModules.filter((module) => module.name.toLowerCase().includes(this.searchQuery()))
      this.filteredModules.set(newFilteredModules)
    } else {
      this.filteredModules.set(this.allModules) // Si no hay consulta, muestra todos los módulos
    }
  }
}

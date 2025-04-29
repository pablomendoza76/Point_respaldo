import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { NavigationEnd, Router, RouterModule } from '@angular/router'
import { DashboardService } from '@modules/administracion/services/dashboard.service'
import { MenuRoutesService } from '@modules/administracion/services/servicios_compartidos/menu-routes.service'
import { NavigationService } from '@modules/administracion/services/servicios_compartidos/navigation.service'
import { IconDropdownComponent } from '@reusables/icon-dropdown/icon-dropdown.component'
import { RoutingService } from '@routing/services/routing.service'
import { filter } from 'rxjs'

@Component({
  selector: 'app-top-nav',
  imports: [MatIconModule, CommonModule, RouterModule, IconDropdownComponent],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss',
})
export class TopNavComponent implements OnInit {
  constructor(
    private navigationService: NavigationService,
    private dashboardService: DashboardService,
    private router: Router,
    private menuRoutesService: MenuRoutesService,
    private srvRouting: RoutingService,
  ) {
    this.srvRouting.routeState$.subscribe((route) => {
      const segments = route?.url.split('/').filter((segment) => segment)
      this.isDashboard = (segments && segments.length === 1 && segments[0] === 'dashboard') || false
    })
  }

  isDashboard = true
  empresa = 'IMELDA JARAMILLO CIA'

  notificationGroups: any[] = []
  welcomeData: any = {}
  groupedModules: any[] = []
  allModules: any[] = []
  filteredModules: any[] = []
  searchQuery: string = ''
  moduloActual: string = ''
  submoduloActual: string = ''

  ngOnInit(): void {
    this.loadData()
    this.detectCurrentRoute()
  }

  private loadData(): void {
    const notifications = this.dashboardService.getNotifications()
    this.notificationGroups = this.groupNotificationsByDate(notifications)
    this.welcomeData = this.navigationService.getWelcomeData()
    this.groupedModules = this.navigationService.getGroupedModules()
    this.allModules = this.groupedModules.flatMap((group: any) => group.modules)
  }

  private detectCurrentRoute(): void {
    const rutas = this.menuRoutesService.getMenuRoutes()

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      const currentUrl = event.urlAfterRedirects.replace(/^\//, '')

      const entries = Object.entries(rutas)

      const matchedSubmodulo = entries.find(([_, path]) => path === currentUrl)
      const matchedModulo = entries.find(([_, path]) => currentUrl.startsWith(path) && path !== matchedSubmodulo?.[1])

      this.submoduloActual = matchedSubmodulo ? matchedSubmodulo[0] : ''
      this.moduloActual = matchedModulo ? matchedModulo[0] : ''
    })
  }

  private groupNotificationsByDate(notifications: any[]): any[] {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    const twoDaysAgo = new Date(today)
    twoDaysAgo.setDate(today.getDate() - 2)

    const formatDateForComparison = (date: Date): string => {
      return date.toISOString().split('T')[0]
    }

    const todayNotifications = notifications.filter((notification) => {
      const notificationDate = new Date(notification.date)
      return formatDateForComparison(notificationDate) === formatDateForComparison(today)
    })

    const yesterdayNotifications = notifications.filter((notification) => {
      const notificationDate = new Date(notification.date)
      return formatDateForComparison(notificationDate) === formatDateForComparison(yesterday)
    })

    const olderNotifications = notifications.filter((notification) => {
      const notificationDate = new Date(notification.date)
      return formatDateForComparison(notificationDate) < formatDateForComparison(twoDaysAgo)
    })

    return [
      { category: 'Hoy', notifications: todayNotifications },
      { category: 'Ayer', notifications: yesterdayNotifications },
      { category: 'Hace más de dos días', notifications: olderNotifications },
    ]
  }

  getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      info: 'fas fa-info-circle text-blue-500',
      warning: 'fas fa-exclamation-triangle text-yellow-500',
      error: 'fas fa-times-circle text-red-pp-500',
      success: 'fas fa-check-circle text-green-500',
    }
    return icons[type] || 'fas fa-bell text-gray-500'
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

  filterModules(event: Event): void {
    const inputElement = event.target as HTMLInputElement
    this.searchQuery = inputElement.value.toLowerCase()

    if (this.searchQuery) {
      this.filteredModules = this.allModules.filter((module) => module.name.toLowerCase().includes(this.searchQuery))
    } else {
      this.filteredModules = []
    }
  }

  navigateTo(option: string): void {
    const routes: { [key: string]: string } = this.menuRoutesService.getMenuRoutes()
    const route = routes[option]
    if (route) {
      this.router.navigate([route])
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

  highlightModule(module: any): void {
    module.selected = true
  }

  unhighlightModule(module: any): void {
    module.selected = false
  }
}

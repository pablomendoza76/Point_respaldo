import { CommonModule } from '@angular/common'
import { AfterViewInit, Component, computed, OnInit, signal } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { Router, RouterModule } from '@angular/router'
import { BusinessStat, Notification, NotificationGroup, TopProduct } from '@modules/administracion/Interfaces/billing-sof-admin/adminDashboard'
import { DashboardService } from '@modules/administracion/services/dashboard.service'
import { ModulosTarjetasComponent } from '@reusables/modulos-tarjetas/modulos-tarjetas.component'
import { MODULE_ROUTES } from '@routing/enums/modules.enum'
import { RouteProps } from '@routing/interfaces/route.interface'
import { Chart } from 'chart.js/auto'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [MatIconModule, CommonModule, RouterModule, ModulosTarjetasComponent],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  businessStats = signal<Record<string, BusinessStat>>({})
  notifications = signal<Notification[]>([])
  notificationGroups = signal<NotificationGroup[]>([])
  salesData = signal<any[]>([])
  searchQuery = signal<string>('')
  topProducts = signal<TopProduct[]>([])
  sidebarOpen = signal<boolean>(false)

  allModules: RouteProps[] = MODULE_ROUTES
  filteredModules = computed(() => (this.searchQuery() ? this.allModules.filter((m) => m.name && m.name.toLowerCase().includes(this.searchQuery())) : this.allModules))

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

  toggleSidebar() {
    this.sidebarOpen.update((prev) => !prev)
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
      error: 'fas fa-times-circle text-red-pp-500',
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

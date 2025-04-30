import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'
import { HomeModuleCardComponent } from '@reusables/home-module-card/home-module-card.component'
import { ROOT_GESTION_PEDIDOS } from '@routing/enums/gestion-pedidos.enum'
import { RouteProps } from '@routing/interfaces/route.interface'

@Component({
  selector: 'app-home',
  imports: [MatIconModule, HomeModuleCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  childrenModules: RouteProps[] = ROOT_GESTION_PEDIDOS.children || []
}

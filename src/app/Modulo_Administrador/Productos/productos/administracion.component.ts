import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuRoutesService } from '../../../services/servicios_compartidos/menu-routes.service';

@Component({
  selector: 'app-administracion',
  standalone: true,
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.scss'],
  imports: [CommonModule, RouterModule, FormsModule],
})
export class AdministracionComponent implements OnInit {
  isAdminMenuCollapsed: boolean = true; // Estado del menú (colapsado o expandido)
  menuRoutes: { [key: string]: string } = {}; // Rutas del menú
  menuIcons: { [key: string]: string } = {}; // Iconos del menú

  constructor(
    private router: Router,
    private menuRoutesService: MenuRoutesService // Inyectar el servicio
  ) {}

  ngOnInit(): void {
    // Obtener las rutas del menú desde el servicio
    this.menuRoutes = this.menuRoutesService.getMenuRoutes();
  }

  // Método para redireccionar según la opción seleccionada
  navigateTo(option: string): void {
    const ruta = this.menuRoutes[option];
    if (ruta) {
      this.router.navigate([ruta]);
    }
  }

  // Método para alternar el estado del menú (colapsado/expandido)
  toggleAdminMenu(): void {
    this.isAdminMenuCollapsed = !this.isAdminMenuCollapsed;
  }

 // Método para verificar si la opción está activa
 isActive(option: string): boolean {
  const ruta = this.menuRoutes[option];
  console.log(ruta)
  return ruta ? this.router.url.includes(ruta) : false;
}
}

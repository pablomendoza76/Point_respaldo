import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class AppComponent implements OnInit {
  usuario: string = '';
  password: string = '';
  recordar: boolean = false;
  showPassword: boolean = false;
  usuarioAutenticado: boolean = false; // Estado de autenticación

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Verificar si el usuario ya está autenticado al cargar la aplicación
    const token = localStorage.getItem('authToken');
    if (token) {
      this.usuarioAutenticado = true; // Usuario autenticado

      // No redirigir si ya está en una ruta válida
      const currentUrl = this.router.url;
      if (currentUrl === '/login') {
        // Si el usuario está en la página de login, redirigir a la ruta por defecto
        this.router.navigate(['/administrador']);
      }
      // Si no, dejar que la aplicación cargue la ruta actual
    }
  }

  onLogin() {
    console.log('Usuario:', this.usuario, 'Contraseña:', this.password);
    console.log('Recordar cuenta:', this.recordar);

    // Lógica de autenticación básica
    if (this.usuario === 'Pablo' && this.password === '12345') {
      this.usuarioAutenticado = true; // Cambiar a autenticado
      localStorage.setItem('authToken', 'token_simulado'); // Guardar token en localStorage

      // Obtener el parámetro returnUrl de la URL
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/administrador';

      // Redirigir al usuario a la ruta almacenada o al dashboard por defecto
      this.router.navigateByUrl(returnUrl);
    } else {
      console.log('Credenciales incorrectas');
      alert('Usuario o contraseña incorrectos');
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  logout() {
    this.usuarioAutenticado = false; // Cambiar a no autenticado
    localStorage.removeItem('authToken'); // Eliminar el token
    this.router.navigate(['/']); // Redirigir al login
  }
}
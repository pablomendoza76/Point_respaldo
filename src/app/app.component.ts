import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class AppComponent {
  usuario: string = '';
  password: string = '';
  recordar: boolean = false;
  showPassword: boolean = false;
  usuarioAutenticado: boolean = false; // 🔴 Se añade esta variable

  constructor(private router: Router) {}

  onLogin() {
    console.log("Usuario:", this.usuario, "Contraseña:", this.password);
    console.log("Recordar cuenta:", this.recordar);

    if (this.usuario === 'Pablo' && this.password === '12345') {
      this.usuarioAutenticado = true; // ✅ Cambia a autenticado
      this.router.navigate(['administrador']);
    } else {
      console.log('Credenciales incorrectas');
      alert('Usuario o contraseña incorrectos');
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}

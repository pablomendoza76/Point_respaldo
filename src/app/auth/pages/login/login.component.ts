import { Location } from '@angular/common'
import { AfterViewInit, Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthData, Credentials } from '@auth/interfaces/auth.interface'
import { AuthService } from '@auth/services/auth.service'

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements AfterViewInit {
  constructor(private location: Location, private route: ActivatedRoute, private router: Router, private srvAuth: AuthService) {
    this.srvAuth.isAuth$.subscribe((auth) => {
      if (auth) this.router.navigateByUrl('/dashboard')
    })
  }

  credentials: Credentials = {
    usuario: '',
    clave: '',
  }
  checked: boolean = false
  recordar: boolean = false
  showPassword: boolean = false

  ngAfterViewInit(): void {
    const session = this.route.snapshot.queryParams['session']
    if (!!session && session === 'expired') {
      this.location.replaceState('/login')
      console.error({
        title: 'La sesión ha caducado',
        message: 'Volver a iniciar sesión',
      })
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword
  }

  login() {
    // clean data
    const credentials: Credentials = {
      usuario: this.credentials.usuario.trim(),
      clave: this.credentials.clave,
    }

    this.srvAuth.login(credentials).subscribe({
      next: (response: { data: AuthData }) => {
        const authData = response.data
        this.srvAuth.saveToken(authData)
      },
      error: (error) => {
        console.error({
          title: 'Error de autenticación',
          message: error.error.message,
        })
      },
    })
  }
}

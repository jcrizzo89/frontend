import { Component, OnInit } from '@angular/core';
import { UserRole } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../../../core/services/auth.service';
import { User, LoginResponse } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  error: string | null = null;
  loading = false;
  matcher = new ErrorStateMatcher();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isLoggedIn()) {
      console.log('Usuario ya autenticado, redirigiendo al dashboard');
      this.router.navigate(['/admin/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = null;

      const { username, password } = this.loginForm.value;
      
      if (username === 'admin' && password === 'admin') {
        // Crear un token JWT simulado válido (header.payload.signature)
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
          sub: '1',
          email: 'admin@agualuz.com',
          role: 'admin',
          exp: Math.floor(Date.now() / 1000) + 3600, // Expira en 1 hora
          iat: Math.floor(Date.now() / 1000)
        }));
        const signature = 'mock-signature';
        const mockToken = `${header}.${payload}.${signature}`;
        
        const mockResponse: LoginResponse = {
          token: mockToken,
          refreshToken: 'mock-refresh-token',
          user: {
            id: '1',
            email: 'admin@agualuz.com',
            nombre: 'Admin',
            apellido: 'Sistema',
            rol: UserRole.ADMIN,
            activo: true,
            fechaCreacion: new Date(),
            notificaciones: 0,
            preferencias: {
              tema: 'sistema',
              notificaciones: true,
              idioma: 'es'
            }
          },
          expiresIn: 3600
        };

        try {
          // Guardar la sesión
          this.authService.setSession(mockResponse);
          console.log('Sesión guardada correctamente');
          console.log('Usuario actual:', this.authService.getCurrentUser());
          console.log('Token actual:', this.authService.getToken());
          
          // Redirigir al dashboard con la nueva ruta
          this.router.navigate(['/admin/dashboard']).then(
            success => {
              console.log('Navegación exitosa:', success);
              this.loading = false;
            },
            error => {
              console.error('Error en navegación:', error);
              this.loading = false;
              this.error = 'Error al redirigir al dashboard';
            }
          );
        } catch (error) {
          console.error('Error al guardar la sesión:', error);
          this.error = 'Error al iniciar sesión';
          this.loading = false;
        }
      } else {
        this.loading = false;
        this.error = 'Usuario o contraseña incorrectos';
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    return '';
  }
}
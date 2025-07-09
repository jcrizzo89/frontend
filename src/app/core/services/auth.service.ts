import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { 
  User, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  PasswordResetRequest, 
  PasswordResetConfirmRequest,
  UserProfile
} from '../models/user.model';
import { environment } from '../../../environments/environment';
import { NotificationService } from './notification.service';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'auth_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenExpirationTimer: any;
  
  // Estado de autenticación
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  // URLs de redirección
  public redirectUrl: string | null = null;
  
  // Observable público para componentes
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private notification: NotificationService
  ) {
    // Cargar la sesión al iniciar
    this.loadSession();
  }
  
  /**
   * Iniciar sesión
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.handleAuthentication(response)),
      catchError(error => {
        this.notification.showError('Credenciales incorrectas. Por favor, intente de nuevo.');
        return throwError(error);
      })
    );
  }
  
  /**
   * Registrar un nuevo usuario
   */
  register(userData: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData).pipe(
      tap(() => {
        this.notification.showSuccess('¡Registro exitoso! Por favor, inicia sesión.');
      })
    );
  }
  
  /**
   * Cerrar sesión
   */
  logout(navigate: boolean = true): void {
    // Limpiar el almacenamiento local
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    // Limpiar el temporizador de expiración
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
    
    // Actualizar el estado
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    
    // Navegar a la página de inicio de sesión
    if (navigate) {
      this.router.navigate(['/auth/login']);
    }
  }
  
  /**
   * Verificar si el usuario está autenticado
   */
  checkAuth(): Observable<boolean> {
    const token = this.getToken();
    
    // Si no hay token, no está autenticado
    if (!token) {
      return of(false);
    }
    
    // Verificar si el token está expirado
    if (this.jwtHelper.isTokenExpired(token)) {
      // Intentar renovar el token
      return this.refreshToken().pipe(
        map(() => true),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
    }
    
    // Si el token es válido, configurar el temporizador de expiración
    this.setAutoLogout();
    return of(true);
  }
  
  /**
   * Obtener el token de autenticación
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
  
  /**
   * Obtener el token de actualización
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  
  /**
   * Obtener el usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  /**
   * Actualizar el perfil del usuario
   */
  updateProfile(profile: Partial<UserProfile>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, profile).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this.notification.showSuccess('Perfil actualizado correctamente');
      })
    );
  }
  
  /**
   * Cambiar la contraseña
   */
  changePassword(data: { currentPassword: string; newPassword: string }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/change-password`, data).pipe(
      tap(() => {
        this.notification.showSuccess('Contraseña actualizada correctamente');
      })
    );
  }
  
  /**
   * Solicitar restablecimiento de contraseña
   */
  requestPasswordReset(email: string): Observable<void> {
    const request: PasswordResetRequest = { email };
    return this.http.post<void>(`${this.apiUrl}/request-password-reset`, request).pipe(
      tap(() => {
        this.notification.showSuccess('Se ha enviado un correo con las instrucciones para restablecer tu contraseña');
      })
    );
  }
  
  /**
   * Confirmar restablecimiento de contraseña
   */
  resetPassword(data: PasswordResetConfirmRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset-password`, data).pipe(
      tap(() => {
        this.notification.showSuccess('Contraseña restablecida correctamente');
      })
    );
  }
  
  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: string | string[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const roles = Array.isArray(role) ? role : [role];
    return roles.some(r => user.rol === r);
  }
  
  /**
   * Verificar si el usuario tiene alguno de los roles especificados
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    return roles.includes(user.rol);
  }
  
  /**
   * Verificar si el usuario ha iniciado sesión
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  /**
   * Establecer la sesión del usuario
   */
  setSession(response: LoginResponse): void {
    this.handleAuthentication(response);
  }

  // ==================== MÉTODOS PRIVADOS ====================
  
  /**
   * Manejar la autenticación exitosa
   */
  private handleAuthentication(response: LoginResponse): void {
    // Almacenar tokens y datos del usuario
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    
    // Actualizar el estado
    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
    
    // Configurar el temporizador de expiración
    this.setAutoLogout();
    
    // Redirigir a la URL solicitada o a la página de inicio
    const redirectUrl = this.redirectUrl || '/';
    this.redirectUrl = null;
    this.router.navigateByUrl(redirectUrl);
    
    this.notification.showSuccess(`¡Bienvenido/a ${response.user.nombre}!`);
  }
  
  /**
   * Cargar la sesión del almacenamiento local
   */
  private loadSession(): void {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        this.setAutoLogout();
      } catch (error) {
        console.error('Error al cargar la sesión:', error);
        this.logout(false);
      }
    } else {
      this.logout(false);
    }
  }
  
  /**
   * Configurar el cierre de sesión automático
   */
  private setAutoLogout(): void {
    const token = this.getToken();
    if (!token) return;
    
    // Obtener la fecha de expiración del token
    const expirationDate = this.jwtHelper.getTokenExpirationDate(token);
    if (!expirationDate) return;
    
    // Calcular el tiempo restante en milisegundos
    const now = new Date().getTime();
    const expiresIn = expirationDate.getTime() - now - 60000; // 1 minuto antes de que expire
    
    // Limpiar el temporizador anterior si existe
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    
    // Configurar el nuevo temporizador
    this.tokenExpirationTimer = setTimeout(() => {
      this.notification.showInfo('Tu sesión está por expirar. Por favor, guarda tu trabajo.');
      
      // Cerrar sesión después de 1 minuto de la advertencia
      setTimeout(() => {
        this.notification.showWarning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        this.logout();
      }, 60000);
      
    }, Math.max(0, expiresIn - 60000)); // 1 minuto antes de que expire
  }
  
  /**
   * Renovar el token de acceso
   */
  private refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No hay token de actualización disponible'));
    }
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh-token`, { refreshToken }).pipe(
      tap(response => {
        this.handleAuthentication(response);
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }
}
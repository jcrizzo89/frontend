import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private notification: NotificationService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Obtener el token de autenticación
    const token = this.authService.getToken();
    
    // Clonar la solicitud y agregar el token de autorización si existe
    if (token) {
      request = this.addTokenToRequest(request, token);
    }

    // Manejar la respuesta
    return next.handle(request).pipe(
      catchError(error => {
        // Si el error es 401 (No autorizado) y la URL no es de autenticación
        if (error instanceof HttpErrorResponse && error.status === 401 && 
            !request.url.includes('auth/refresh-token') && 
            !request.url.includes('auth/login')) {
          
          // Si el token de actualización no está disponible, forzar cierre de sesión
          if (!this.authService.getRefreshToken()) {
            this.authService.logout();
            return throwError(() => error);
          }
          
          // Usar el método handle401Error para manejar la renovación del token
          return this.handle401Error(request, next);
        }
        
        // Para otros errores, simplemente reenviar el error
        return throwError(() => error);
      })
    );
  }

  /**
   * Agrega el token de autenticación a la solicitud
   */
  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    // No agregar el token a las solicitudes de autenticación
    if (request.url.includes('auth/')) {
      return request;
    }

    // Clonar la solicitud y agregar el encabezado de autorización
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Maneja el error 401 (No autorizado) intentando renovar el token
   */
  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Si ya se está renovando el token, esperar a que termine y luego reintentar
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          return next.handle(this.addTokenToRequest(request, token));
        })
      );
    }

    // Iniciar el proceso de renovación del token
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    // Usar el método checkAuth del AuthService para manejar la renovación del token
    return this.authService.checkAuth().pipe(
      switchMap(isAuthenticated => {
        this.isRefreshing = false;
        
        if (isAuthenticated) {
          // Si la autenticación fue exitosa, obtener el nuevo token
          const newToken = this.authService.getToken();
          if (newToken) {
            this.refreshTokenSubject.next(newToken);
            // Reintentar la solicitud original con el nuevo token
            return next.handle(this.addTokenToRequest(request, newToken));
          }
        }
        
        // Si la autenticación falló, forzar cierre de sesión
        this.notification.showError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        this.authService.logout();
        return throwError(() => new Error('Authentication failed'));
      }),
      catchError(error => {
        this.isRefreshing = false;
        this.notification.showError('Error al renovar la sesión. Por favor, inicia sesión nuevamente.');
        this.authService.logout();
        return throwError(() => error);
      })
    );
  }
}

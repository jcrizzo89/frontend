import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notification: NotificationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si el error ya fue manejado por otro interceptor, no hacer nada
        if (error.status === 401 || error.status === 403) {
          return throwError(() => error);
        }

        // Manejar diferentes tipos de errores
        switch (error.status) {
          case 0:
            // Sin conexión
            this.notification.showError('No se pudo conectar al servidor. Verifica tu conexión a internet.');
            break;
          
          case 400:
            // Solicitud incorrecta
            this.handleBadRequestError(error);
            break;
          
          case 404:
            // Recurso no encontrado
            this.notification.showError('El recurso solicitado no existe o no está disponible.');
            break;
          
          case 422:
            // Error de validación
            this.handleValidationError(error);
            break;
          
          case 500:
            // Error interno del servidor
            this.handleServerError(error);
            break;
          
          default:
            // Otros errores
            this.notification.showError('Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.');
        }

        // Reenviar el error para que otros manejadores puedan procesarlo
        return throwError(() => error);
      })
    );
  }

  /**
   * Maneja errores de validación (422)
   */
  private handleValidationError(error: HttpErrorResponse): void {
    const errorMessage = this.extractValidationErrors(error);
    this.notification.showError(errorMessage || 'Por favor, verifica los datos ingresados.');
  }

  /**
   * Extrae mensajes de error de validación del backend
   */
  private extractValidationErrors(error: HttpErrorResponse): string {
    if (!error.error || !error.error.errors) {
      return 'Error de validación';
    }

    // Si el error es un objeto con mensajes de validación
    if (typeof error.error.errors === 'object') {
      const errors = error.error.errors;
      return Object.keys(errors)
        .map(key => `${errors[key].join(' ')}`)
        .join('\n');
    }

    // Si el error es un array de mensajes
    if (Array.isArray(error.error.errors)) {
      return error.error.errors.join('\n');
    }

    // Si el error es un mensaje simple
    return error.error.message || 'Error de validación';
  }

  /**
   * Maneja errores de solicitud incorrecta (400)
   */
  private handleBadRequestError(error: HttpErrorResponse): void {
    const message = error.error?.message || 'La solicitud no pudo ser procesada.';
    this.notification.showError(message);
  }

  /**
   * Maneja errores internos del servidor (500+)
   */
  private handleServerError(error: HttpErrorResponse): void {
    const message = error.error?.message || 'Ocurrió un error en el servidor. Por favor, inténtalo más tarde.';
    this.notification.showError(message);
    
    // Aquí podrías enviar el error a un servicio de monitoreo como Sentry
    // this.logErrorToService(error);
  }

  /**
   * Registra el error en un servicio de monitoreo
   */
  private logErrorToService(error: HttpErrorResponse): void {
    // Implementar lógica para enviar el error a un servicio como Sentry, LogRocket, etc.
    console.error('Error del servidor:', error);
  }
}

import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private defaultDuration = 5000; // 5 segundos
  private defaultHorizontalPosition: 'start' | 'center' | 'end' | 'left' | 'right' = 'end';
  private defaultVerticalPosition: 'top' | 'bottom' = 'top';

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Muestra una notificación de éxito
   * @param message Mensaje a mostrar
   * @param action Texto del botón de acción
   * @param config Configuración adicional
   */
  showSuccess(
    message: string, 
    action: string = 'Cerrar', 
    config: MatSnackBarConfig = {}
  ): MatSnackBarRef<TextOnlySnackBar> {
    return this.show(message, 'success', action, config);
  }

  /**
   * Muestra una notificación de error
   * @param message Mensaje a mostrar
   * @param action Texto del botón de acción
   * @param config Configuración adicional
   */
  showError(
    message: string, 
    action: string = 'Cerrar', 
    config: MatSnackBarConfig = {}
  ): MatSnackBarRef<TextOnlySnackBar> {
    return this.show(message, 'error', action, config);
  }

  /**
   * Muestra una notificación de advertencia
   * @param message Mensaje a mostrar
   * @param action Texto del botón de acción
   * @param config Configuración adicional
   */
  showWarning(
    message: string, 
    action: string = 'Cerrar', 
    config: MatSnackBarConfig = {}
  ): MatSnackBarRef<TextOnlySnackBar> {
    return this.show(message, 'warning', action, config);
  }

  /**
   * Muestra una notificación informativa
   * @param message Mensaje a mostrar
   * @param action Texto del botón de acción
   * @param config Configuración adicional
   */
  showInfo(
    message: string, 
    action: string = 'Cerrar', 
    config: MatSnackBarConfig = {}
  ): MatSnackBarRef<TextOnlySnackBar> {
    return this.show(message, 'info', action, config);
  }

  /**
   * Muestra una notificación
   * @param message Mensaje a mostrar
   * @param type Tipo de notificación
   * @param action Texto del botón de acción
   * @param config Configuración adicional
   */
  private show(
    message: string,
    type: NotificationType = 'info',
    action: string = 'Cerrar',
    config: MatSnackBarConfig = {}
  ): MatSnackBarRef<TextOnlySnackBar> {
    // Configuración por defecto
    const defaultConfig: MatSnackBarConfig = {
      duration: this.defaultDuration,
      horizontalPosition: this.defaultHorizontalPosition,
      verticalPosition: this.defaultVerticalPosition,
      panelClass: this.getPanelClass(type),
      data: { message, action, type }
    };

    // Combinar con la configuración personalizada
    const finalConfig = { ...defaultConfig, ...config };

    // Mostrar el snackbar
    return this.snackBar.open(message, action, finalConfig);
  }

  /**
   * Obtiene las clases CSS según el tipo de notificación
   * @param type Tipo de notificación
   */
  private getPanelClass(type: NotificationType): string[] {
    const baseClass = 'notification-snackbar';
    
    switch (type) {
      case 'success':
        return [`${baseClass}--success`, baseClass];
      case 'error':
        return [`${baseClass}--error`, baseClass];
      case 'warning':
        return [`${baseClass}--warning`, baseClass];
      case 'info':
      default:
        return [`${baseClass}--info`, baseClass];
    }
  }

  /**
   * Cierra todas las notificaciones abiertas
   */
  dismissAll(): void {
    this.snackBar.dismiss();
  }

  /**
   * Muestra un mensaje de error de servidor
   * @param error Error recibido del servidor
   * @param defaultMessage Mensaje por defecto en caso de que el error no tenga mensaje
   */
  showServerError(error: any, defaultMessage: string = 'Ocurrió un error en el servidor'): void {
    let errorMessage = defaultMessage;
    
    if (error?.error?.message) {
      // Error con mensaje personalizado
      errorMessage = error.error.message;
    } else if (error?.status === 0) {
      // Sin conexión
      errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
    } else if (error?.status === 401) {
      // No autorizado
      errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
    } else if (error?.status === 403) {
      // Prohibido
      errorMessage = 'No tienes permisos para realizar esta acción.';
    } else if (error?.status === 404) {
      // No encontrado
      errorMessage = 'El recurso solicitado no existe.';
    } else if (error?.status === 500) {
      // Error interno del servidor
      errorMessage = 'Error interno del servidor. Por favor, inténtalo más tarde.';
    } else if (error?.status === 422) {
      // Error de validación
      errorMessage = 'Error de validación. Verifica los datos ingresados.';
    }
    
    this.showError(errorMessage);
  }
}

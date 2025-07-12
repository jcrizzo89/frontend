import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DateInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Solo procesar solicitudes POST y PUT que vayan a /clientes
    if ((request.method === 'POST' || request.method === 'PUT') && request.url.includes('/clientes')) {
      const body = this.convertDates(request.body);
      request = request.clone({ body });
    }
    return next.handle(request);
  }

  private convertDates(input: any): any {
    // Si no es un objeto, devolver el valor tal cual
    if (!input || typeof input !== 'object') {
      return input;
    }

    // Si es un array, procesar cada elemento
    if (Array.isArray(input)) {
      return input.map(item => this.convertDates(item));
    }

    // Si es un objeto Date, devolverlo como está
    if (input instanceof Date) {
      return input;
    }

    // Si es un objeto, procesar cada propiedad
    const result: any = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        let value = input[key];
        
        // Procesar el campo fIngreso
        if (key === 'fIngreso' && value) {
          try {
            // Si es string, convertirlo a Date
            if (typeof value === 'string') {
              const date = new Date(value);
              if (!isNaN(date.getTime())) {
                value = date;
              } else {
                console.warn('Fecha inválida, usando fecha actual');
                value = new Date();
              }
            }
            // Si no es un Date, intentar convertirlo
            else if (!(value instanceof Date)) {
              const date = new Date(value);
              value = isNaN(date.getTime()) ? new Date() : date;
            }
            
            // Asegurarse de que el valor sea un objeto Date
            if (!(value instanceof Date)) {
              value = new Date();
            }
          } catch (e) {
            console.error('Error al procesar la fecha:', e);
            value = new Date();
          }
        } 
        // Si el valor es un objeto, procesarlo recursivamente
        else if (value !== null && typeof value === 'object') {
          value = this.convertDates(value);
        }
        
        result[key] = value;
      }
    }
    return result;
  }
}

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpEventType
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  // Lista blanca de URLs que no deben mostrar el indicador de carga
  private readonly whitelistedUrls = [
    '/assets/',
    'i18n/',
    'sockjs-node/'
  ];

  constructor(private loadingService: LoadingService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Verificar si la URL está en la lista blanca
    if (this.isWhitelisted(request.url)) {
      return next.handle(request);
    }

    // Mostrar el indicador de carga
    this.loadingService.show();

    // Contador de solicitudes en curso
    this.loadingService.incrementPendingRequests();

    return next.handle(request).pipe(
      tap(event => {
        // Manejar respuestas exitosas (opcional)
        if (event.type === HttpEventType.Response) {
          // Aquí podrías implementar lógica adicional para respuestas exitosas
        }
      }),
      finalize(() => {
        // Ocultar el indicador de carga cuando la solicitud finaliza
        this.loadingService.decrementPendingRequests();
        
        // Si no hay más solicitudes pendientes, ocultar el indicador
        if (this.loadingService.getPendingRequests() === 0) {
          this.loadingService.hide();
        }
      })
    );
  }

  /**
   * Verifica si una URL está en la lista blanca
   */
  private isWhitelisted(url: string): boolean {
    return this.whitelistedUrls.some(whitelistedUrl => 
      url.includes(whitelistedUrl)
    );
  }
}

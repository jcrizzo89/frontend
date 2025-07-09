import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private pendingRequests = 0;

  // Observable para componentes que necesitan conocer el estado de carga
  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  /**
   * Muestra el indicador de carga
   */
  show(): void {
    this.isLoadingSubject.next(true);
  }

  /**
   * Oculta el indicador de carga
   */
  hide(): void {
    this.isLoadingSubject.next(false);
  }

  /**
   * Incrementa el contador de solicitudes pendientes
   */
  incrementPendingRequests(): void {
    this.pendingRequests++;
    if (this.pendingRequests > 0) {
      this.show();
    }
  }

  /**
   * Decrementa el contador de solicitudes pendientes
   */
  decrementPendingRequests(): void {
    this.pendingRequests = Math.max(0, this.pendingRequests - 1);
    if (this.pendingRequests === 0) {
      this.hide();
    }
  }

  /**
   * Obtiene el número de solicitudes pendientes
   */
  getPendingRequests(): number {
    return this.pendingRequests;
  }

  /**
   * Resetea el contador de solicitudes pendientes
   */
  reset(): void {
    this.pendingRequests = 0;
    this.hide();
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Distribuidor, DistribuidorPedido } from '../models/distribuidor.model';
import { environment } from '../../../../environments/environment';
import { MOCK_DISTRIBUIDORES, MOCK_PEDIDOS } from '../mock/mock-data';

@Injectable({
  providedIn: 'root'
})
export class DistribuidoresService {
  private apiUrl = `${environment.apiUrl}/distribuidores`;
  private useMockData = true; // Cambiar a false cuando el backend esté listo

  constructor(private http: HttpClient) {}

  getDistribuidor(id: string): Observable<Distribuidor> {
    if (this.useMockData) {
      const distribuidor = MOCK_DISTRIBUIDORES.find(d => d.id === id);
      return distribuidor ? of(distribuidor) : throwError(() => new Error('Distribuidor no encontrado'));
    }
    return this.http.get<Distribuidor>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateDistribuidor(distribuidor: Distribuidor): Observable<Distribuidor> {
    if (this.useMockData) {
      const index = MOCK_DISTRIBUIDORES.findIndex(d => d.id === distribuidor.id);
      if (index !== -1) {
        MOCK_DISTRIBUIDORES[index] = { ...distribuidor, ultimaActualizacion: new Date() };
        return of(MOCK_DISTRIBUIDORES[index]);
      }
      return throwError(() => new Error('Distribuidor no encontrado'));
    }
    return this.http.put<Distribuidor>(`${this.apiUrl}/${distribuidor.id}`, distribuidor).pipe(
      catchError(this.handleError)
    );
  }

  getPedidosHistorial(distribuidorId: string): Observable<DistribuidorPedido[]> {
    if (this.useMockData) {
      const pedidos = MOCK_PEDIDOS[distribuidorId] || [];
      return of(pedidos);
    }
    return this.http.get<DistribuidorPedido[]>(`${this.apiUrl}/${distribuidorId}/pedidos`).pipe(
      catchError(this.handleError)
    );
  }

  getPedidos(distribuidorId: string): Observable<DistribuidorPedido[]> {
    if (this.useMockData) {
      const pedidos = MOCK_PEDIDOS[distribuidorId] || [];
      return of(pedidos);
    }
    return this.http.get<DistribuidorPedido[]>(`${this.apiUrl}/${distribuidorId}/pedidos`).pipe(
      catchError(this.handleError)
    );
  }

  updatePedido(pedido: DistribuidorPedido): Observable<DistribuidorPedido> {
    if (this.useMockData) {
      const distribuidorPedidos = Object.values(MOCK_PEDIDOS).flat();
      const index = distribuidorPedidos.findIndex(p => p.id === pedido.id);
      if (index !== -1) {
        distribuidorPedidos[index] = { ...pedido };
        return of(distribuidorPedidos[index]);
      }
      return throwError(() => new Error('Pedido no encontrado'));
    }
    return this.http.put<DistribuidorPedido>(`${this.apiUrl}/pedidos/${pedido.id}`, pedido).pipe(
      catchError(this.handleError)
    );
  }

  exportPedido(pedido: DistribuidorPedido): Observable<boolean> {
    if (this.useMockData) {
      // Simular una exportación exitosa
      return of(true);
    }
    return this.http.post<boolean>(`${this.apiUrl}/pedidos/${pedido.id}/export`, {}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error en el servidor';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

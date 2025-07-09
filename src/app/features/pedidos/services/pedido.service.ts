import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido, PedidoFormData, EstadoPedido, ProductoPedido, EstadoPedidoHistorial } from '../models/pedido.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los pedidos con filtros opcionales
   */
  getAll(filters?: {
    estado?: string;
    fechaInicio?: Date;
    fechaFin?: Date;
    idCliente?: string;
    idRepartidor?: string;
  }): Observable<Pedido[]> {
    let params: any = {};
    if (filters) {
      if (filters.estado) params.estado = filters.estado;
      if (filters.fechaInicio) params.fechaInicio = filters.fechaInicio.toISOString();
      if (filters.fechaFin) params.fechaFin = filters.fechaFin.toISOString();
      if (filters.idCliente) params.idCliente = filters.idCliente;
      if (filters.idRepartidor) params.idRepartidor = filters.idRepartidor;
    }
    return this.http.get<Pedido[]>(this.apiUrl, { params });
  }

  /**
   * Obtiene un pedido por su ID
   */
  getById(id: string): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo pedido
   */
  create(pedido: PedidoFormData): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, pedido);
  }

  /**
   * Actualiza un pedido existente
   */
  update(id: string, pedido: Partial<PedidoFormData>): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/${id}`, pedido);
  }

  /**
   * Actualiza el estado de un pedido
   */
  updateEstado(id: string, estado: EstadoPedido, observaciones?: string): Observable<Pedido> {
    return this.http.patch<Pedido>(
      `${this.apiUrl}/${id}/estado`,
      { estado, observaciones }
    );
  }

  /**
   * Asigna un repartidor a un pedido
   */
  asignarRepartidor(id: string, idRepartidor: string): Observable<Pedido> {
    return this.http.patch<Pedido>(
      `${this.apiUrl}/${id}/asignar`,
      { idRepartidor }
    );
  }

  /**
   * Obtiene el historial de estados de un pedido
   */
  getHistorialEstados(id: string): Observable<EstadoPedidoHistorial[]> {
    return this.http.get<EstadoPedidoHistorial[]>(
      `${this.apiUrl}/${id}/historial`
    );
  }

  /**
   * Agrega un producto a un pedido
   */
  addProducto(id: string, producto: Omit<ProductoPedido, 'idProducto'>): Observable<Pedido> {
    return this.http.post<Pedido>(
      `${this.apiUrl}/${id}/productos`,
      producto
    );
  }

  /**
   * Actualiza un producto en un pedido
   */
  updateProducto(id: string, idProducto: string, producto: Partial<ProductoPedido>): Observable<Pedido> {
    return this.http.put<Pedido>(
      `${this.apiUrl}/${id}/productos/${idProducto}`,
      producto
    );
  }

  /**
   * Elimina un producto de un pedido
   */
  removeProducto(id: string, idProducto: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}/productos/${idProducto}`
    );
  }

  /**
   * Obtiene estadísticas de pedidos
   */
  getEstadisticas(params: {
    fechaInicio: Date;
    fechaFin: Date;
    agruparPor?: 'dia' | 'semana' | 'mes' | 'año';
  }): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/estadisticas`, {
      params: {
        fechaInicio: params.fechaInicio.toISOString(),
        fechaFin: params.fechaFin.toISOString(),
        agruparPor: params.agruparPor || 'dia'
      }
    });
  }
}

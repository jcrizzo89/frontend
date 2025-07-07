import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3001/pedidos';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<Order[]> {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      map((backendOrders) => backendOrders.map(order => this.mapOrder(order)))
    );
  }

  private mapOrder(order: any): Order {
  return {
    id: order.idPedido,
    nroPedido: order.nroPedido,
    estado: order.estado,
    clientName: order.cliente?.nombre || 'Desconocido',
    phone: order.cliente?.telefono,
    address: order.cliente?.direccion,
    canal: order.canal,
    entrada: order.entrada,
    enviar: order.enviar,
    salida: order.salida,
    despachado: order.despachado,
    observaciones: order.observaciones,
    zona: order.zona?.nombre,
    importe: Number(order.importe),
    repartidor: order.repartidor?.nombre,
    pagaCon: Number(order.pagaCon),
    linea: order.linea,
    talonario: order.talonario,
    descuento: Number(order.descuento),
    productos: order.productosPedidos?.map((p: any) => ({
      nombre: p.nombre,
      cantidad: p.cantidad,
      precio: p.precio
    })) || [],
    historialEstados: order.historialEstados?.map((h: any) => ({
      estado: h.estado,
      fecha: h.fecha
    })),
    latitudEntrega: order.latitudEntrega,
    longitudEntrega: order.longitudEntrega,
  };
}

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  updateOrder(id: string, order: Partial<Order>): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}`, order);
  }

  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateOrderStatus(id: string, estado: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/estado`, { estado });
  }
}

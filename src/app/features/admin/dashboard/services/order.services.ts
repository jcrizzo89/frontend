import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Order } from '../models/order.model';
import { map, Observable, catchError, throwError } from 'rxjs';

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
    try {
      // Map the frontend order to the backend's expected format
      const backendOrder: any = {
        observaciones: order.observaciones,
        estado: order.estado,
        nombre: order.clientName,
        cantidadBotellones: order.cantidad,
        // Only include these fields if they exist in the order
        ...(order.importe && { importe: order.importe }),
        ...(order.notaPedido && { notaPedido: order.notaPedido }),
        ...(order.tipoBotellon && { tipoBotellon: order.tipoBotellon })
      };

      // Handle zona specially - only include if it exists and has a value
      if (order.zona) {
        // If zona is an object with idZona, use that, otherwise use the value directly
        const zonaObj = order.zona as any;
        backendOrder.zona = typeof order.zona === 'object' && 'idZona' in zonaObj 
          ? zonaObj.idZona 
          : order.zona;
      }

      console.log('Sending update request with data:', JSON.stringify(backendOrder, null, 2));
      
      return this.http.put<Order>(`${this.apiUrl}/${id}`, backendOrder).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error updating order:', error);
          if (error.error) {
            console.error('Error status:', error.status);
            console.error('Error details:', error.error);
            console.error('Error message:', error.message);
          }
          return throwError(() => new Error(`Error al actualizar el pedido: ${error.message}`));
        })
      );
    } catch (error) {
      console.error('Error preparing update request:', error);
      return throwError(() => error);
    }
  }

  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateOrderStatus(id: string, estado: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/estado`, { estado });
  }
}

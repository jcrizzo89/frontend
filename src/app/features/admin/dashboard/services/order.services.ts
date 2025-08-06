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
      console.log('Raw order data received in updateOrder:', JSON.stringify(order, null, 2));
      
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

      // Handle zona specially - ensure we're sending the ID, not the name
      if (order.zona) {
        console.log('Processing zona:', order.zona);
        
        // If zona is an object with idZona or id
        if (order.zona && typeof order.zona === 'object') {
          const zonaObj = order.zona as any;
          if (zonaObj.idZona) {
            backendOrder.idZona = zonaObj.idZona;
            console.log('Using idZona from object:', zonaObj.idZona);
          } else if (zonaObj.id) {
            backendOrder.idZona = zonaObj.id;
            console.log('Using id from object as idZona:', zonaObj.id);
          } else if (zonaObj.nombre) {
            // If we only have a name, use it as a fallback (not ideal but better than failing)
            backendOrder.idZona = zonaObj.nombre;
            console.warn('Using zone name as idZona fallback:', zonaObj.nombre);
          }
        } 
        // If zona is a string (should be handled by the component, but just in case)
        else if (typeof order.zona === 'string') {
          console.warn('Received string zona in updateOrder. This should be handled by the component. Value:', order.zona);
          backendOrder.idZona = order.zona;
        }
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

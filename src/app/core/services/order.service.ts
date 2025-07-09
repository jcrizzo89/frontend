//         driver: 'Esteban',
//         time: '16:11:26',
//         duration: '30:00:00',
//         date: '17/09/2024',
//         channel: 'whatsapp',
//         status: 'pending'
//       }
//       // Add more mock data here
//     ];

//     this.ordersSubject.next(mockOrders);
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order } from '../models/order.interface';
import { Client } from '../models/client.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/pedidos`;
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private activeClientsSubject = new BehaviorSubject<Client[]>([]);
  
  // Observable que emite la lista actual de pedidos
  public orders$ = this.ordersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  // Actualiza el estado de un pedido
  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/estado`, { estado: status });
  }

  // Obtener todos los pedidos
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  // Obtener clientes activos
  getActiveClients(): Observable<Client[]> {
    return this.activeClientsSubject.asObservable();
  }

  // Crear nuevo pedido
  createOrder(order: Omit<Order, 'id'>): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  // Actualizar pedido
  updateOrder(id: number, order: Partial<Order>): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, order);
  }

  // Cargar datos iniciales
  private loadInitialData() {
    this.getOrders().subscribe({
      next: (orders) => {
        this.ordersSubject.next(orders);
      },
      error: (error) => {
        console.error('Error cargando pedidos:', error);
      }
    });
  }
}
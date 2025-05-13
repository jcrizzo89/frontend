// // // import { Injectable } from '@angular/core';

// // // @Injectable({
// // //   providedIn: 'root'
// // // })
// // // export class OrderService {

// // //   constructor() { }
// // // }

// // import { Injectable } from '@angular/core';
// // import { HttpClient } from '@angular/common/http';
// // import { Observable } from 'rxjs';

// // interface Order {
// //   id: number;
// //   clientId: number;
// //   distributorId: number;
// //   status: string;
// //   createdAt: Date;
// // }

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class OrderService {
// //   private apiUrl = '/api/orders';

// //   constructor(private http: HttpClient) { }

// //   getOrders(): Observable<Order[]> {
// //     return this.http.get<Order[]>(this.apiUrl);
// //   }

// //   createOrder(order: Partial<Order>): Observable<Order> {
// //     return this.http.post<Order>(this.apiUrl, order);
// //   }

// //   updateOrderStatus(id: number, status: string): Observable<Order> {
// //     return this.http.patch<Order>(`${this.apiUrl}/${id}`, { status });
// //   }

// //   getOrdersByDistributor(distributorId: number): Observable<Order[]> {
// //     return this.http.get<Order[]>(`${this.apiUrl}/distributor/${distributorId}`);
// //   }
// // }




// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { Order } from '../models/order.interface';
// import { Client } from '../models/client.interface';

// @Injectable({
//   providedIn: 'root'
// })
// export class OrderService {
//   updateOrderStatus(orderId: number, status: string) {
//     throw new Error('Method not implemented.');
//   }
//   private apiUrl = 'your-api-url';
  
//   private ordersSubject = new BehaviorSubject<Order[]>([]);
//   private activeClientsSubject = new BehaviorSubject<Client[]>([]);

//   constructor(private http: HttpClient) {
//     this.loadInitialData();
//   }

//   // Obtener todos los pedidos
//   getOrders(): Observable<Order[]> {
//     return this.ordersSubject.asObservable();
//   }

//   // Obtener clientes activos
//   getActiveClients(): Observable<Client[]> {
//     return this.activeClientsSubject.asObservable();
//   }

//   // Crear nuevo pedido
//   createOrder(order: Omit<Order, 'id'>): Observable<Order> {
//     return this.http.post<Order>(`${this.apiUrl}/orders`, order);
//   }

//   // Actualizar pedido
//   updateOrder(id: number, order: Partial<Order>): Observable<Order> {
//     return this.http.patch<Order>(`${this.apiUrl}/orders/${id}`, order);
//   }

//   // Cargar datos iniciales
//   private loadInitialData() {
//     // Mock data for testing
//     const mockOrders: Order[] = [
//       {
//         id: 1,
//         phone: '0983429271',
//         clientName: 'ESCUELA FE Y ALEGRÍA',
//         destination: 'Olmedo y Cuba - Zona 14',
//         observations: 'Portón madera esquina casa 2 aguas',
//         orderDetails: '3 botellones azules',
//         notes: 'Sábado por la tarde Horario pref: de 16 a 17',
//         zone: '14',
//         vehicle: '14',
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

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'your-api-url'; // Asegúrate de poner la URL correcta
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private activeClientsSubject = new BehaviorSubject<Client[]>([]);

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  // Actualiza el estado de un pedido
  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/orders/${orderId}/status`, { status });
  }

  // Obtener todos los pedidos
  getOrders(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }

  // Obtener clientes activos
  getActiveClients(): Observable<Client[]> {
    return this.activeClientsSubject.asObservable();
  }

  // Crear nuevo pedido
  createOrder(order: Omit<Order, 'id'>): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders`, order);
  }

  // Actualizar pedido
  updateOrder(id: number, order: Partial<Order>): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/orders/${id}`, order);
  }

  // Cargar datos iniciales
  private loadInitialData() {
    // Mock data for testing
    const mockOrders: Order[] = [
      {
        id: 1,
        phone: '0983429271',
        clientName: 'ESCUELA FE Y ALEGRÍA',
        destination: 'Olmedo y Cuba - Zona 14',
        observations: 'Portón madera esquina casa 2 aguas',
        orderDetails: '3 botellones azules',
        notes: 'Sábado por la tarde Horario pref: de 16 a 17',
        zone: '14',
        vehicle: '14',
        driver: 'Esteban',
        time: '16:11:26',
        duration: '30:00:00',
        date: '17/09/2024',
        channel: 'whatsapp',
        status: 'pending'
      }
    ];

    this.ordersSubject.next(mockOrders);
  }
}

// // features/delivery/active-orders/active-orders.component.ts
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MaterialModule } from '../../../shared/material/material.module';
// import { OrderService } from '../../../core/services/order.service';

// @Component({
//  selector: 'app-active-orders',
//  standalone: true,
//  imports: [CommonModule, MaterialModule],
//   templateUrl: './active-orders.component.html',
//   styleUrl: './active-orders.component.css'
// })
// export class ActiveOrdersComponent {
//  activeOrders: any[] = [];
//  displayedColumns: string[] = ['id', 'client', 'address', 'status'];

//  constructor(private orderService: OrderService) {
//    this.loadOrders();
//  }

//  loadOrders() {
//    this.orderService.getOrders().subscribe(orders => {
//      this.activeOrders = orders;
//    });
//  }

//  updateStatus(orderId: string, newStatus: string) {
//   this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
//     next: (response) => {
//       console.log('Estado actualizado con éxito');
//       // Aquí puedes agregar lógica adicional después de actualizar
//     },
//     error: (error) => {
//       console.error('Error al actualizar el estado:', error);
//     }
//   });
// }
// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material/material.module';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.interface';

@Component({
  selector: 'app-active-orders',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './active-orders.component.html',
  styleUrl: './active-orders.component.css'
})
export class ActiveOrdersComponent implements OnInit {
  // Tipado correcto para activeOrders
  activeOrders: Order[] = [];
  
  displayedColumns: string[] = ['id', 'client', 'address', 'status'];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (orders: Order[]) => {
        this.activeOrders = orders;
      },
      error: (error: any) => {
        console.error('Error cargando órdenes:', error);
      }
    });
  }

  updateStatus(orderId: number, newStatus: string): void {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (response: Order) => {
        console.log('Estado actualizado con éxito');
        // Recargar las órdenes después de actualizar
        this.loadOrders();
      },
      error: (error: any) => {
        console.error('Error al actualizar el estado:', error);
      }
    });
  }
}
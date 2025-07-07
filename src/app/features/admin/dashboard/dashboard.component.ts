// features/admin/dashboard/dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { OrderCardComponent } from './components/order-card/order-card.component';
import { StatsPanelComponent } from './components/stats-panel/stats-panel.component';
import { OrdersTableComponent } from './components/orders-table/orders-table.component';

import { EstadoPedido, Order } from './models/order.model';
import { OrderService } from './services/order.services';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    OrderCardComponent,
    StatsPanelComponent,
    OrdersTableComponent,
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentTime = new Date();
  searchQuery = '';
  currentFilter: 'all' | EstadoPedido = 'all';

  orders: Order[] = [];
  stats = {
    unregisteredOrders: 0,
    repeatedOrders: 0
  };

  private subscriptions = new Subscription();

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
    setInterval(() => (this.currentTime = new Date()), 1000);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadOrders(): void {
    const sub = this.orderService.getAllOrders().subscribe({
      next: (orders) => (this.orders = orders),
      error: (err) => console.error('Error loading orders:', err)
    });
    this.subscriptions.add(sub);
  }

  get activeOrders(): Order[] {
    return this.orders.slice(0, 2);
  }

  get filteredOrders(): Order[] {
    let filtered = [...this.orders];

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.clientName.toLowerCase().includes(query) ||
        order.phone?.includes(query) ||
        order.address?.toLowerCase().includes(query)
      );
    }

    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(order => order.estado === this.currentFilter);
    }

    return filtered;
  }

  setFilter(filter: 'all' | 'Pendiente' | 'Entregado'): void {
    this.currentFilter = filter;
  }

  onEditOrder(order: Order): void {
    const sub = this.orderService.updateOrder(order.id, order).subscribe({
      next: (updated) => {
        const index = this.orders.findIndex(o => o.id === updated.id);
        if (index !== -1) this.orders[index] = updated;
        console.log('Order updated:', updated);
      },
      error: (err) => console.error('Error updating order:', err)
    });
    this.subscriptions.add(sub);
  }

  deleteOrder(orderId: string): void {
    const sub = this.orderService.deleteOrder(orderId).subscribe({
      next: () => {
        this.orders = this.orders.filter(o => o.id !== orderId);
        console.log('Order deleted:', orderId);
      },
      error: (err) => console.error('Error deleting order:', err)
    });
    this.subscriptions.add(sub);
  }

  deleteSelected(): void {
    console.log('Deleting selected orders...');
    // TODO: Implementar lógica de eliminación múltiple
  }

  addNewOrder(): void {
    console.log('Adding new order...');
    // TODO: Implementar lógica para agregar un nuevo pedido
  }

  onAddProgress(orderId: string): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      console.log('Adding progress to order:', order);
      // TODO: Implementar lógica de progreso
    }
  }

  onViewDetails(): void {
    console.log('Viewing stats details...');
    console.log('Unregistered orders:', this.stats.unregisteredOrders);
    console.log('Repeated orders:', this.stats.repeatedOrders);
    // TODO: Implementar lógica para mostrar detalles de estadísticas
  }
}

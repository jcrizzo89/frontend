import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule
  ],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit, OnDestroy {
  searchTerm = '';
  filter: 'all' | 'pending' | 'delivered' | 'cancelled' = 'all';
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = true;
  updatingStatus: { [key: string]: boolean } = {};
  error: string | null = null;
  private subscription = new Subscription();

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;
    
    // Suscribirse al observable de órdenes
    const ordersSub = this.orderService.orders$.subscribe({
      next: (orders) => {
        this.orders = orders || [];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar los pedidos:', err);
        this.error = 'Error al cargar los pedidos. Intente nuevamente más tarde.';
        this.loading = false;
      }
    });
    
    this.subscription.add(ordersSub);
  }

  onSearch(): void {
    this.applyFilters();
  }

  setFilter(filter: 'all' | 'pending' | 'delivered' | 'cancelled'): void {
    this.filter = filter;
    this.applyFilters();
  }

  getStatusColor(estado: string): string {
    if (!estado) return '';
    
    const status = estado.toLowerCase();
    switch (status) {
      case 'pendiente':
      case 'en_proceso':
        return 'accent';
      case 'entregado':
      case 'completado':
        return 'primary';
      case 'cancelado':
      case 'rechazado':
        return 'warn';
      default:
        return '';
    }
  }

  private applyFilters(): void {
    if (!this.orders || this.orders.length === 0) {
      this.filteredOrders = [];
      return;
    }

    let filtered = [...this.orders];
    
    // Aplicar filtro de estado
    if (this.filter !== 'all') {
      filtered = filtered.filter(order => {
        if (!order.estado) return false;
        
        const status = order.estado.toLowerCase();
        const filterStatus = this.filter.toLowerCase();
        
        // Manejar diferentes variaciones de estados
        if (filterStatus === 'pending') {
          return status === 'pendiente' || status === 'en_proceso' || status === 'en proceso';
        } else if (filterStatus === 'delivered') {
          return status === 'entregado' || status === 'completado';
        } else if (filterStatus === 'cancelled') {
          return status === 'cancelado' || status === 'rechazado';
        }
        
        return status === filterStatus;
      });
    }
    
    // Aplicar búsqueda
    if (this.searchTerm) {
      const searchTerm = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(order => {
        const clientName = (order.nombre || order.clienteNombre || '').toLowerCase();
        const phone = (order.telefono || '').toLowerCase();
        const destination = (order.direccion || '').toLowerCase();
        const details = ((order.detalles || '') + ' ' + (order.observaciones || '')).toLowerCase();
        const orderId = (order.idPedido || order.nroPedido?.toString() || '').toLowerCase();
        
        // Buscar en todos los campos relevantes
        return (
          clientName.includes(searchTerm) ||
          phone.includes(searchTerm) ||
          destination.includes(searchTerm) ||
          details.includes(searchTerm) ||
          orderId.includes(searchTerm)
        );
      });
    }
    
    this.filteredOrders = filtered;
  }

  refreshOrders(): void {
    this.loadOrders();
  }

  formatStatus(status: string): string {
    if (!status) return '';
    
    // Reemplazar guiones bajos por espacios y capitalizar cada palabra
    return status
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getStatusIcon(status: string): string {
    if (!status) return 'help_outline';
    
    const statusLower = status.toLowerCase();
    
    switch (statusLower) {
      case 'pendiente':
        return 'schedule';
      case 'en_proceso':
      case 'en proceso':
        return 'hourglass_empty';
      case 'entregado':
        return 'check_circle';
      case 'cancelado':
        return 'cancel';
      default:
        return 'help_outline';
    }
  }

  isUpdating(order: Order): boolean {
    if (!order || order.idPedido === undefined || order.idPedido === null) return false;
    return !!this.updatingStatus[order.idPedido.toString()];
  }

  updateOrderStatus(order: Order, newStatus: string): void {
    if (!order || order.idPedido === undefined || order.idPedido === null) {
      console.error('No se puede actualizar el estado: ID de pedido no válido');
      return;
    }

    const orderId = order.idPedido.toString();
    const statusKey = `${orderId}_${newStatus}`;
    
    // Establecer el estado de carga para este botón específico
    this.updatingStatus[statusKey] = true;
    this.error = null;

    // Convertir el ID a número para la llamada al servicio
    const numericOrderId = Number(order.idPedido);
    if (isNaN(numericOrderId)) {
      console.error('ID de pedido no es un número válido:', order.idPedido);
      this.updatingStatus[statusKey] = false;
      return;
    }

    const currentStatus = order.estado;
    
    // Actualizar el estado localmente para una respuesta más rápida
    order.estado = newStatus as any;
    
    // Llamar al servicio para actualizar el estado en el backend
    const updateSub = this.orderService.updateOrderStatus(numericOrderId, newStatus).subscribe({
      next: (updatedOrder) => {
        // Actualizar la orden en la lista local
        const index = this.orders.findIndex(o => o.idPedido === order.idPedido);
        if (index !== -1) {
          this.orders[index] = { ...this.orders[index], ...updatedOrder };
          this.applyFilters();
        }
      },
      error: (error) => {
        console.error('Error al actualizar el estado del pedido:', error);
        // Revertir el cambio si hay un error
        order.estado = currentStatus as any;
        this.error = 'Error al actualizar el estado del pedido. Intente nuevamente.';
        this.applyFilters();
      },
      complete: () => {
        // Limpiar el estado de carga para este botón específico
        this.updatingStatus[statusKey] = false;
      }
    });
    
    this.subscription.add(updateSub);
  }
}

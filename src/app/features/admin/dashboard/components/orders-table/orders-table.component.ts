import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule]
})
export class OrdersTableComponent {
  @Input() orders: Order[] = [];
  @Output() editOrder = new EventEmitter<Order>();

  onEditOrder(order: Order): void {
    this.editOrder.emit(order);
  }
}

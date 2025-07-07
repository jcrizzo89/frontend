import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Order } from '../../models/order.model'; // Asegúrate de que la ruta es correcta

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule]
})
export class OrderCardComponent {
  @Input() order!: Order;
  @Input() active = false;
  @Input() orderCount?: number;
  @Output() addProgress = new EventEmitter<string>();

  onAddProgress() {
    this.addProgress.emit(this.order.id);
  }
}

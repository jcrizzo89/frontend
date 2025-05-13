import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule]
})
export class OrderCardComponent {
  @Input() order: any;
  @Input() active = false;
  @Input() orderNumber: number = 0;
  @Output() addProgress = new EventEmitter<string>();

  onAddProgress() {
    this.addProgress.emit(this.order.id);
  }
}

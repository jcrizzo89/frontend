import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

interface CallItem {
  phoneNumber: string;
  location: string;
  address: string;
  addressDetails: string;
  products: string;
  schedule?: string;
  contactName: string;
  timestamp: string;
  duration: string;
  date: string;
  source: string;
  status: 'pending' | 'delivered' | 'cancelled';
}

@Component({
  selector: 'app-call-item',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './call-item.component.html',
  styleUrls: ['./call-item.component.css']
})
export class CallItemComponent {
  @Input() call: CallItem = {
    phoneNumber: '0985 123048',
    location: 'MIRA MADERA',
    address: 'SAN ANDRES Y ATAHUALPA "PRIMAVERA"',
    addressDetails: 'Azul 3P Enlucida Portón negro junto a cancha azul',
    products: '2 botellones transparentes',
    schedule: 'Dejar antes de las 12',
    contactName: 'Esteban',
    timestamp: '16:08:16',
    duration: '00:00:10',
    date: '17/09/2024',
    source: 'pedido por chat wpp',
    status: 'pending'
  };

  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() call = new EventEmitter<void>();

  getStatusIcon(): string {
    switch (this.call.status) {
      case 'delivered':
        return 'check_circle';
      case 'cancelled':
        return 'cancel';
      default:
        return 'schedule';
    }
  }

  getStatusClass(): string {
    return `status-${this.call.status}`;
  }
}

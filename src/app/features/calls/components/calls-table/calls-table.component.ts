import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface Call {
  id: string;
  datetime: Date;
  phoneAndClient: {
    phone: string;
    client: string;
  };
  destination: {
    address: string;
    observations: string;
  };
  order: {
    details: string;
    notes: string;
  };
  zone: {
    name: string;
    vehicle: string;
  };
  channel: 'whatsapp' | 'phone';
  status: 'pending' | 'missed' | 'completed';
  callbackTime?: string;
}

@Component({
  selector: 'app-calls-table',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './calls-table.component.html',
  styleUrls: ['./calls-table.component.css']
})
export class CallsTableComponent {
  @Input() calls: Call[] = [];
  @Output() callback = new EventEmitter<Call>();
  @Output() viewDetails = new EventEmitter<Call>();

  columns = [
    { key: 'datetime', label: 'Fecha y hora', width: '1fr' },
    { key: 'phoneAndClient', label: 'Teléfono y cliente', width: '1.5fr' },
    { key: 'destination', label: 'Destino y observaciones', width: '2fr' },
    { key: 'order', label: 'Pedido y notas de pedido', width: '2fr' },
    { key: 'zone', label: 'Zona y vehículo', width: '1fr' },
    { key: 'callback', label: 'Volver a llamar', width: '1fr' },
    { key: 'channel', label: 'Canal', width: '0.5fr' },
    { key: 'status', label: 'Estado', width: '1fr' }
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'missed': return 'status-missed';
      case 'completed': return 'status-completed';
      default: return 'status-pending';
    }
  }

  getChannelIcon(channel: 'whatsapp' | 'phone'): string {
    return channel === 'whatsapp' ? 'whatsapp' : 'phone';
  }

  onCallback(call: Call) {
    this.callback.emit(call);
  }

  onViewDetails(call: Call) {
    this.viewDetails.emit(call);
  }
}

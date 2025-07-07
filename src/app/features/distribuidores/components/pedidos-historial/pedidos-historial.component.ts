import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DISTRIBUIDOR_CONSTANTS } from '../../constants/distribuidor.constants';
import { Order } from '../../../admin/dashboard/models/order.model';

@Component({
  selector: 'app-pedidos-historial',
  templateUrl: './pedidos-historial.component.html',
  styleUrls: ['./pedidos-historial.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PedidosHistorialComponent {
  @Input() pedidos: Order[] = [];
  @Output() pedidoUpdated = new EventEmitter<Order>();
  @Output() exportPedido = new EventEmitter<Order>();

  ESTADOS = DISTRIBUIDOR_CONSTANTS.ESTADOS;
  searchTerm = '';
  filterStatus = '';
  sortBy: 'entrada' | 'estado' | 'clientName' | 'zona' | 'canal' | '' = '';
  sortAscending = true;

get filteredPedidos(): Order[] {
  return this.pedidos
    .filter(pedido =>
      (this.searchTerm === '' ||
       pedido.clientName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       pedido.zona?.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (this.filterStatus === '' || pedido.estado === this.filterStatus)
    )
    .sort((a, b) => {
      if (this.sortBy === '') return 0;

      const aValue = a[this.sortBy];
      const bValue = b[this.sortBy];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return this.sortAscending ? -1 : 1;
      if (bValue == null) return this.sortAscending ? 1 : -1;

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return this.sortAscending ? comparison : -comparison;
    });
}


  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
  }

  onFilterStatus(status: string) {
    this.filterStatus = status;
  }

  onSort(field: 'entrada' | 'estado' | 'clientName' | 'zona' | 'canal') {
    if (this.sortBy === field) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortBy = field;
      this.sortAscending = true;
    }
  }

  onUpdatePedido(pedido: Order) {
    this.pedidoUpdated.emit(pedido);
  }

  onExportPedido(pedido: Order) {
    this.exportPedido.emit(pedido);
  }
}

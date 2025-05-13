import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DistribuidorPedido } from '../../models/distribuidor.model';
import { DISTRIBUIDOR_CONSTANTS } from '../../constants/distribuidor.constants';

@Component({
  selector: 'app-pedidos-historial',
  templateUrl: './pedidos-historial.component.html',
  styleUrls: ['./pedidos-historial.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PedidosHistorialComponent {
  @Input() pedidos: DistribuidorPedido[] = [];
  @Output() pedidoUpdated = new EventEmitter<DistribuidorPedido>();
  @Output() exportPedido = new EventEmitter<DistribuidorPedido>();

  ESTADOS = DISTRIBUIDOR_CONSTANTS.ESTADOS;
  searchTerm = '';
  filterStatus = '';
  sortBy: 'fechaHora' | 'estado' | '' = '';
  sortAscending = true;

  get filteredPedidos(): DistribuidorPedido[] {
    return this.pedidos
      .filter(pedido => 
        (this.searchTerm === '' || 
         pedido.cliente.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
         pedido.destino.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
        (this.filterStatus === '' || pedido.estado === this.filterStatus)
      )
      .sort((a, b) => {
        if (this.sortBy === '') return 0;
        
        const aValue = a[this.sortBy];
        const bValue = b[this.sortBy];
        
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

  onSort(field: 'fechaHora' | 'estado') {
    if (this.sortBy === field) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortBy = field;
      this.sortAscending = true;
    }
  }

  onUpdatePedido(pedido: DistribuidorPedido) {
    this.pedidoUpdated.emit(pedido);
  }

  onExportPedido(pedido: DistribuidorPedido) {
    this.exportPedido.emit(pedido);
  }
}

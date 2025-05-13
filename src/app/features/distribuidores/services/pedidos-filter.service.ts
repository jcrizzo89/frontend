import { Injectable } from '@angular/core';
import { DistribuidorPedido } from '../models/distribuidor.model';

@Injectable({
  providedIn: 'root'
})
export class PedidosFilterService {
  filterPedidos(
    pedidos: DistribuidorPedido[],
    searchTerm: string,
    filterStatus: string,
    sortBy: string,
    sortAscending: boolean
  ): DistribuidorPedido[] {
    let filtered = [...pedidos];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(pedido => 
        pedido.cliente.toLowerCase().includes(term) ||
        pedido.destino.toLowerCase().includes(term) ||
        pedido.observaciones?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter(pedido => 
        pedido.estado === filterStatus
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'fechaHora':
          comparison = new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime();
          break;
        case 'cliente':
          comparison = a.cliente.localeCompare(b.cliente);
          break;
        case 'estado':
          comparison = a.estado.localeCompare(b.estado);
          break;
        default:
          comparison = 0;
      }
      return sortAscending ? comparison : -comparison;
    });

    return filtered;
  }
}

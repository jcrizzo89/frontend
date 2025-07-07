import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OrdersTableComponent } from '../../../shared/components/orders-table/orders-table.component';

interface Order {
  id: string;
  phone: string;
  clientName: string;
  destination: string;
  observations: string;
  status: 'pending' | 'delivered' | 'cancelled';
  // Agrega más propiedades según sea necesario
}

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    OrdersTableComponent
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit {
  searchTerm: string = '';
  filter: 'all' | 'pending' | 'delivered' = 'all';
  orders: Order[] = [];
  filteredOrders: Order[] = [];

  ngOnInit(): void {
    // Aquí deberías cargar los pedidos desde tu servicio
    this.loadOrders();
  }

  loadOrders(): void {
    // Simulación de carga de datos
    // Reemplaza esto con una llamada a tu servicio
    this.orders = [
      // Datos de ejemplo
      {
        id: '1',
        phone: '123456789',
        clientName: 'Cliente Ejemplo',
        destination: 'Dirección de ejemplo',
        observations: 'Sin observaciones',
        status: 'pending'
      }
    ];
    this.filteredOrders = [...this.orders];
  }

  onSearch(): void {
    this.applyFilters();
  }

  setFilter(filter: 'all' | 'pending' | 'delivered'): void {
    this.filter = filter;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      // Aplicar filtro de búsqueda
      const matchesSearch = !this.searchTerm || 
        order.clientName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.phone.includes(this.searchTerm);
      
      // Aplicar filtro de estado
      const matchesFilter = this.filter === 'all' || order.status === this.filter;
      
      return matchesSearch && matchesFilter;
    });
  }

  refreshOrders(): void {
    this.loadOrders();
  }
}

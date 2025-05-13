// features/admin/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { OrderCardComponent } from './components/order-card/order-card.component';
import { StatsPanelComponent } from './components/stats-panel/stats-panel.component';
import { OrdersTableComponent } from './components/orders-table/orders-table.component';
import { Order } from './models/order.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    OrderCardComponent,
    StatsPanelComponent,
    OrdersTableComponent
  ]
})
export class DashboardComponent implements OnInit {
  currentTime = new Date();
  searchQuery = '';
  currentFilter: 'all' | 'pendiente' | 'entregado' = 'all';
  
  orders: Order[] = [
    {
      id: '0983429271',
      phone: '0983429271',
      clientName: 'ESCUELA FE Y ALEGRIA',
      address: 'Olmedo y Cuba - Zona 14',
      notes: 'Porton madera esta más casa 2 aguas',
      products: '3 botellones azules',
      zone: 'Zona 14',
      time: '15:36',
      date: '05/11/2024',
      channel: 'whatsapp',
      status: 'pendiente',
      highlighted: true,
      orderCount: '85 pedidos - cliente bueno'
    },
    {
      id: '0985 123048',
      phone: '0985 123048',
      clientName: 'MIRA MADERA',
      address: 'SAN ANDRES Y ATAHUALPA "PRIMAVERA"',
      notes: 'Azul 3P Enfriada Porton negro junto a cancha',
      products: '2 botellones transparentes',
      zone: 'H',
      time: '16:08:16',
      date: '05/11/2024',
      channel: 'whatsapp',
      status: 'pendiente',
      highlighted: false
    },
    {
      id: '0985 123048',
      phone: '0985 123048',
      clientName: 'MIRA MADERA',
      address: 'SAN ANDRES Y ATAHUALPA "PRIMAVERA"',
      notes: 'Azul 3P Enfriada Porton negro junto a cancha zur',
      products: '3 botellones azules',
      zone: 'M',
      time: '16:08:16',
      date: '05/11/2024',
      channel: 'phone',
      status: 'pendiente',
      highlighted: false
    },
    {
      id: '0985 123048',
      phone: '0985 123048',
      clientName: 'MIRA MADERA',
      address: 'SAN ANDRES Y ATAHUALPA "PRIMAVERA"',
      notes: 'Azul 3P Enfriada Porton negro junto a cancha',
      products: '1 botellon azul',
      zone: 'H',
      time: '16:08:16',
      date: '05/11/2024',
      channel: 'phone',
      status: 'entregado',
      highlighted: false
    },
    {
      id: '0985 123048',
      phone: '0985 123048',
      clientName: 'MIRA MADERA',
      address: 'SAN ANDRES Y ATAHUALPA "PRIMAVERA"',
      notes: 'Azul 3P Enfriada Porton negro junto a cancha',
      products: '4 botellones azul llave',
      zone: 'H',
      time: '16:08:16',
      date: '05/11/2024',
      channel: 'whatsapp',
      status: 'pendiente',
      highlighted: false
    },
    {
      id: '0985 123048',
      phone: '0985 123048',
      clientName: 'MIRA MADERA',
      address: 'SAN ANDRES Y ATAHUALPA "PRIMAVERA"',
      notes: 'Azul 3P Enfriada Porton negro junto a cancha',
      products: '1 botellon azul',
      zone: 'H',
      time: '16:08:16',
      date: '05/11/2024',
      channel: 'phone',
      status: 'pendiente',
      highlighted: false
    }
  ];

  stats = {
    unregisteredOrders: 3,
    repeatedOrders: 0
  };

  get activeOrders() {
    return this.orders.slice(0, 2);
  }

  get filteredOrders(): Order[] {
    let orders = [...this.orders];
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      orders = orders.filter(order => 
        order.clientName.toLowerCase().includes(query) ||
        order.phone.includes(query) ||
        order.address.toLowerCase().includes(query)
      );
    }

    if (this.currentFilter !== 'all') {
      orders = orders.filter(order => order.status === this.currentFilter);
    }

    return orders;
  }

  setFilter(filter: 'all' | 'pendiente' | 'entregado'): void {
    this.currentFilter = filter;
  }

  ngOnInit() {
    // Update time every second
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  onEditOrder(order: Order): void {
    // Find and update the order in the list
    const index = this.orders.findIndex(o => o.id === order.id);
    if (index !== -1) {
      this.orders[index] = { ...order };
      console.log('Order updated:', order);
    }
  }

  editOrder(orderId: string) {
    console.log('Editing order:', orderId);
    // Implement edit order logic
  }

  deleteOrder(orderId: string) {
    console.log('Deleting order:', orderId);
    // Implement delete order logic
  }

  deleteSelected() {
    console.log('Deleting selected orders');
    // Implement delete selected logic
  }

  addNewOrder() {
    console.log('Adding new order');
    // Implement add new order logic
  }

  onAddProgress(orderId: string) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      console.log('Adding progress to order:', order);
      // Implement progress logic here
    }
  }

  onViewDetails() {
    console.log('Viewing stats details');
    console.log('Unregistered orders:', this.stats.unregisteredOrders);
    console.log('Repeated orders:', this.stats.repeatedOrders);
    // Implement detailed stats view logic
  }
}
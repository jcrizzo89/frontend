// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-orders-table',
//   standalone: true,
//   imports: [],
//   templateUrl: './orders-table.component.html',
//   styleUrl: './orders-table.component.css'
// })
// export class OrdersTableComponent {
// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Order } from '../../../core/models/order.interface';
import { OrderService } from '../../../core/services/order.service';


@Component({
  selector: 'app-orders-table',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule
  ],
  template: `
    <div class="table-container">
      <div class="filters">
        <mat-form-field class="search">
          <input matInput placeholder="Buscar pedidos">
        </mat-form-field>
        
        <div class="filter-options">
          <mat-checkbox checked>Todos</mat-checkbox>
          <mat-checkbox>Entrega pendiente</mat-checkbox>
          <mat-checkbox>Entregados</mat-checkbox>
          <mat-checkbox>Ocultos</mat-checkbox>
        </div>
      </div>

      <table mat-table [dataSource]="orders" class="orders-table">
        <!-- Columnas de la tabla -->
        <ng-container matColumnDef="client">
          <th mat-header-cell *matHeaderCellDef>Teléfono y cliente</th>
          <td mat-cell *matCellDef="let order">
            <div>{{order.phone}}</div>
            <div>{{order.clientName}}</div>
          </td>
        </ng-container>

        <!-- Más columnas... -->

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .table-container {
      background: #EAEAEA;
      border-radius: 24px;
      padding: 24px;
    }

    .filters {
      display: flex;
      gap: 24px;
      margin-bottom: 24px;

      .search {
        width: 419px;
      }

      .filter-options {
        display: flex;
        align-items: center;
        gap: 16px;
      }
    }

    .orders-table {
      width: 100%;
    }
  `]
})
export class OrdersTableComponent implements OnInit {
  orders: Order[] = [];
  displayedColumns: string[] = ['client', 'destination', 'order', 'zone', 'time', 'channel', 'status', 'actions'];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getOrders().subscribe((orders: Order[]) => {
      this.orders = orders;
    });
  }
}

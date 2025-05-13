// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-client-card',
//   standalone: true,
//   imports: [],
//   templateUrl: './client-card.component.html',
//   styleUrl: './client-card.component.css'
// })
// export class ClientCardComponent {

// }


import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-client-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],
  template: `
    <mat-card class="client-card">
      <div class="card-header">
        <div class="number">{{clientNumber}}</div>
        <div class="info">
          <div class="phone">{{phone}}</div>
          <div class="stats">{{orderCount}} pedidos - cliente {{clientType}}</div>
        </div>
        <div class="timestamp">
          <div>{{date}}</div>
          <div>{{time}}</div>
        </div>
      </div>
      
      <div class="card-content">
        <div class="section">
          <div class="label">DESTINO</div>
          <div class="value">{{destination}}</div>
        </div>
        
        <div class="section">
          <div class="label">OBSERVACIONES Y PEDIDO</div>
          <div class="value">{{observations}}</div>
        </div>
        
        <div class="actions">
          <button mat-button color="primary">Editar contacto</button>
          <button mat-raised-button color="primary">Agregar pedido</button>
        </div>
      </div>
    </mat-card>
  `,
  styles: [`
    .client-card {
      width: 551px;
      height: 243px;
      background: rgba(1, 18, 47, 0.48);
      border: 1px solid #32A2DA;
      border-radius: 24px;
      color: white;
      padding: 16px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .number {
        font-size: 32px;
        font-weight: 700;
        color: #A0A4AA;
      }

      .info {
        .phone {
          font-size: 24px;
          font-weight: 500;
        }
        .stats {
          font-size: 16px;
        }
      }

      .timestamp {
        font-size: 12px;
        text-align: center;
      }
    }

    .card-content {
      .section {
        margin-bottom: 16px;

        .label {
          color: #32A2DA;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .value {
          font-size: 18px;
        }
      }

      .actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
      }
    }
  `]
})
export class ClientCardComponent {
  @Input() clientNumber: string = '';
  @Input() phone: string = '';
  @Input() orderCount: number = 0;
  @Input() clientType: 'bueno' | 'regular' = 'regular';
  @Input() date: string = '';
  @Input() time: string = '';
  @Input() destination: string = '';
  @Input() observations: string = '';
}
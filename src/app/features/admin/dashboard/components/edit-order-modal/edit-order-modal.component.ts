import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { Order } from '../../models/order.model';

@Component({
  selector: 'app-edit-order-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Editar pedido</h2>
    <mat-dialog-content>
      <div class="edit-order-form">
        <div class="form-group">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Para</mat-label>
            <input matInput [(ngModel)]="order.clientName" name="clientName">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Domicilio</mat-label>
            <input matInput [(ngModel)]="order.address" name="address">
            <a mat-icon-button [href]="getMapsLink()" target="_blank" matSuffix>
              <mat-icon>map</mat-icon>
            </a>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Observaciones</mat-label>
            <textarea matInput [(ngModel)]="order.observaciones" name="observaciones" rows="2"></textarea>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Zona</mat-label>
              <mat-select [(ngModel)]="order.zona" name="zona">
                <mat-option *ngFor="let zone of zones" [value]="zone">
                  {{zone}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Conductor</mat-label>
              <mat-select [(ngModel)]="order.repartidor" name="repartidor">
                <mat-option *ngFor="let driver of drivers" [value]="driver">
                  {{driver}}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Estado</mat-label>
            <mat-select [(ngModel)]="order.estado" name="estado">
              <mat-option *ngFor="let status of statuses" [value]="status">
                {{status}}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Tipo de botellón</mat-label>
              <mat-select [(ngModel)]="order.tipoBotellon" name="tipoBotellon">
                <mat-option *ngFor="let type of bottleTypes" [value]="type">
                  {{type}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Cantidad</mat-label>
              <input matInput type="number" [(ngModel)]="order.cantidad" name="cantidad">
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nota de pedido</mat-label>
            <input matInput [(ngModel)]="order.notaPedido" name="notaPedido">
          </mat-form-field>

          <mat-checkbox [(ngModel)]="order.noNotificar" name="noNotificar">
            Aún no notificar al distribuidor
          </mat-checkbox>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSave()">Guardar cambios</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .edit-order-form {
      padding: 16px 0;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .form-row {
      display: flex;
      gap: 16px;
    }
    .full-width {
      width: 100%;
    }
    .half-width {
      flex: 1;
    }
  `]
})
export class EditOrderModalComponent {
  order: Order;
  
  // Datos de ejemplo - reemplazar con datos reales
  zones = ['Zona 1', 'Zona 2', 'Zona 3'];
  drivers = ['Conductor 1', 'Conductor 2', 'Conductor 3'];
  statuses = ['Pendiente', 'En proceso', 'En camino', 'Entregado', 'Cancelado'];
  bottleTypes = ['Botellón grande', 'Botellón chico', 'Bidon 10L', 'Bidon 20L'];

  constructor(
    public dialogRef: MatDialogRef<EditOrderModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { order: Order }
  ) {
    this.order = { ...data.order };
  }

  onSave(): void {
    this.dialogRef.close(this.order);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getMapsLink(): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.order.address || '')}`;
  }
}

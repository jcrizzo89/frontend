import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Distribuidor } from '../../models/distribuidor.model';

@Component({
  selector: 'app-distribuidor-detail',
  templateUrl: './distribuidor-detail.component.html',
  styleUrls: ['./distribuidor-detail.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class DistribuidorDetailComponent {
  @Input() distribuidor!: Distribuidor;
  @Output() distribuidorUpdated = new EventEmitter<Distribuidor>();

  editMode = false;
  editedDistribuidor: Distribuidor | null = null;

  startEdit(): void {
    this.editMode = true;
    this.editedDistribuidor = { ...this.distribuidor };
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editedDistribuidor = null;
  }

  saveChanges(): void {
    if (this.editedDistribuidor) {
      this.distribuidorUpdated.emit(this.editedDistribuidor);
      this.editMode = false;
      this.editedDistribuidor = null;
    }
  }
}

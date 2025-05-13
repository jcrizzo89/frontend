import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Call } from '../calls-table/calls-table.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-call-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './call-details-dialog.component.html',
  styleUrls: ['./call-details-dialog.component.css']
})
export class CallDetailsDialogComponent {
  callbackTime: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { call: Call },
    private dialogRef: MatDialogRef<CallDetailsDialogComponent>
  ) {}

  getStatusLabel(status: string): string {
    switch (status) {
      case 'missed': return 'LLAMADA PERDIDA';
      case 'completed': return 'COMPLETADA';
      default: return 'PENDIENTE';
    }
  }

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

  onScheduleCallback() {
    this.dialogRef.close({ 
      action: 'callback',
      callbackTime: this.callbackTime
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}

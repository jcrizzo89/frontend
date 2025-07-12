import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

export interface ErrorDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title || 'Error' }}</h2>
    <mat-dialog-content>
      <div class="error-message">{{ data.message }}</div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="true" color="primary">Aceptar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .error-message {
      white-space: pre-line;
      margin: 1rem 0;
      line-height: 1.5;
    }
  `]
})
export class ErrorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorDialogData
  ) {}
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ErrorDialogComponent  // Import standalone component directly
  ],
  exports: [
    MatDialogModule,
    MatButtonModule,
    ErrorDialogComponent
  ]
})
export class SharedModule { }

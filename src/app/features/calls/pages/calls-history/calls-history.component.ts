import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CallsFiltersComponent } from '../../components/calls-filters/calls-filters.component';
import { CallsTableComponent, Call } from '../../components/calls-table/calls-table.component';

import { CallsService } from '../../services/calls.service';
import { CallDetailsDialogComponent } from '../../components/call-details-dialog/call-details-dialog.component';

@Component({
  selector: 'app-calls-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    CallsFiltersComponent,
    CallsTableComponent,

  ],
  templateUrl: './calls-history.component.html',
  styleUrls: ['./calls-history.component.css']
})
export class CallsHistoryComponent implements OnInit {
  calls: Call[] = [];
  filteredCalls: Call[] = [];
  isLoading = false;

  constructor(
    private callsService: CallsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadCalls();
  }

  private loadCalls() {
    this.isLoading = true;
    this.callsService.getCalls().subscribe({
      next: (calls) => {
        this.calls = calls;
        this.filteredCalls = calls;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading calls:', error);
        this.snackBar.open('Error al cargar las llamadas', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end'
        });
        this.isLoading = false;
      }
    });
  }

  onFilterChange(filters: { missed: boolean; registered: boolean }) {
    this.filteredCalls = this.calls.filter(call => {
      if (!filters.missed && !filters.registered) return true;
      if (filters.missed && call.status === 'missed') return true;
      if (filters.registered && call.status === 'completed') return true;
      return false;
    });
  }

  onSearch(query: string) {
    const searchTerm = query.toLowerCase();
    this.filteredCalls = this.calls.filter(call => 
      call.phoneAndClient.client.toLowerCase().includes(searchTerm) ||
      call.phoneAndClient.phone.includes(searchTerm) ||
      call.destination.address.toLowerCase().includes(searchTerm)
    );
  }

  onCallback(call: Call) {
    // Por ahora solo actualizaremos el estado a 'pending'
    this.callsService.updateCallStatus(call.id, 'pending').subscribe({
      next: () => {
        this.snackBar.open('Llamada programada correctamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end'
        });
        this.loadCalls(); // Recargar la lista
      },
      error: (error) => {
        console.error('Error scheduling callback:', error);
        this.snackBar.open('Error al programar la llamada', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end'
        });
      }
    });
  }

  onViewDetails(call: Call) {
    this.callsService.getCallDetails(call.id).subscribe({
      next: (details) => {
        const dialogRef = this.dialog.open(CallDetailsDialogComponent, {
          data: { call: details },
          maxWidth: '90vw',
          maxHeight: '90vh'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result?.action === 'callback') {
            this.callsService.scheduleCallback(call.id, result.callbackTime).subscribe({
              next: () => {
                this.snackBar.open('Llamada programada correctamente', 'Cerrar', {
                  duration: 3000,
                  horizontalPosition: 'end'
                });
                this.loadCalls(); // Recargar la lista
              },
              error: (error) => {
                console.error('Error scheduling callback:', error);
                this.snackBar.open('Error al programar la llamada', 'Cerrar', {
                  duration: 3000,
                  horizontalPosition: 'end'
                });
              }
            });
          }
        });
      },
      error: (error) => {
        console.error('Error loading call details:', error);
        this.snackBar.open('Error al cargar los detalles', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end'
        });
      }
    });
  }
}

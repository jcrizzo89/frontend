import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackgroundComponent } from '../../../shared/components/background/background.component';
import { LogoComponent } from '../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-incoming-calls',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    BackgroundComponent,
    LogoComponent
  ],
  templateUrl: './incoming-calls.component.html',
  styleUrls: ['./incoming-calls.component.css']
})
export class IncomingCallsComponent {
  // Estados para los filtros
  selectedFilter: string = 'all';
  searchQuery: string = '';

  // Datos de ejemplo para las llamadas
  calls = [
    {
      phone: '0983429271',
      client: 'ESCUELA FE Y ALEGRÍA',
      location: 'OLMEDO Y CUBA - Zona 14',
      status: 'pending',
      timestamp: new Date()
    }
    // Aquí puedes agregar más llamadas
  ];

  onFilterChange(filter: string) {
    this.selectedFilter = filter;
  }

  onSearch(query: string) {
    this.searchQuery = query;
  }
}

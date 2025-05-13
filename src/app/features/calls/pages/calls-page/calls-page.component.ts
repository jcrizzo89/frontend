import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallsStatsComponent } from '../../components/calls-stats/calls-stats.component';
import { CallsFiltersComponent } from '../../components/calls-filters/calls-filters.component';
import { CallsTableComponent } from '../../components/calls-table/calls-table.component';
import { CallItemComponent } from '../../components/call-item/call-item.component';

@Component({
  selector: 'app-calls-page',
  standalone: true,
  imports: [
    CommonModule,

    CallsStatsComponent,
    CallsFiltersComponent,
    CallsTableComponent,
    CallItemComponent
  ],
  templateUrl: './calls-page.component.html',
  styleUrls: ['./calls-page.component.css']
})
export class CallsPageComponent {
  // Mock data para demostración
  calls = [
    {
      phoneNumber: '0985 123048',
      location: 'MIRA MADERA',
      address: 'SAN ANDRES Y ATAHUALPA "PRIMAVERA"',
      addressDetails: 'Azul 3P Enlucida Portón negro junto a cancha azul',
      products: '2 botellones transparentes',
      schedule: 'Dejar antes de las 12',
      contactName: 'Esteban',
      timestamp: '16:08:16',
      duration: '00:00:10',
      date: '17/09/2024',
      source: 'pedido por chat wpp',
      status: 'pending' as const
    },
    {
      phoneNumber: '0985 456789',
      location: 'LA FLORESTA',
      address: 'AV. CORUÑA Y TOLEDO',
      addressDetails: 'Edificio azul, piso 3, oficina 304',
      products: '3 botellones azules',
      schedule: 'Horario de oficina',
      contactName: 'María',
      timestamp: '15:30:22',
      duration: '00:01:15',
      date: '17/09/2024',
      source: 'llamada directa',
      status: 'delivered' as const
    }
  ];

  stats = {
    unregisteredCalls: 3,
    repeatedCalls: 0,
    timestamp: '16:56:28',
    date: '05/11/2024',
    location: 'ECUADOR'
  };

  onFilterChange(filter: string) {
    console.log('Filter changed:', filter);
  }

  onSearchChange(query: string) {
    console.log('Search query:', query);
  }

  onEditCall(index: number) {
    console.log('Edit call:', this.calls[index]);
  }

  onDeleteCall(index: number) {
    console.log('Delete call:', this.calls[index]);
  }
}

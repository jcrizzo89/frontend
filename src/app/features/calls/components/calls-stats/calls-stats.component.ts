import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

interface CallStats {
  unregisteredCalls: number;
  repeatedCalls: number;
  timestamp: string;
  date: string;
  location: string;
}

@Component({
  selector: 'app-calls-stats',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './calls-stats.component.html',
  styleUrls: ['./calls-stats.component.css']
})
export class CallsStatsComponent {
  @Input() stats: CallStats = {
    unregisteredCalls: 3,
    repeatedCalls: 0,
    timestamp: '16:56:28',
    date: '05/11/2024',
    location: 'ECUADOR'
  };

  onViewDetails() {
    // Implementar navegación a detalles
    console.log('Ver detalles de llamadas');
  }
}

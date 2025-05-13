import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stats-panel',
  templateUrl: './stats-panel.component.html',
  styleUrls: ['./stats-panel.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule]
})
export class StatsPanelComponent {
  @Input() currentTime = new Date();
  @Input() stats = {
    unregisteredOrders: 0,
    repeatedOrders: 0
  };
  @Output() viewDetails = new EventEmitter<void>();

  onViewDetails() {
    this.viewDetails.emit();
  }
}

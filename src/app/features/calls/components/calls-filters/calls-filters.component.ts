import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

export interface CallFilter {
  missed: boolean;
  registered: boolean;
}

@Component({
  selector: 'app-calls-filters',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    FormsModule
  ],
  templateUrl: './calls-filters.component.html',
  styleUrls: ['./calls-filters.component.css']
})
export class CallsFiltersComponent {
  @Output() filterChange = new EventEmitter<CallFilter>();
  @Output() searchChange = new EventEmitter<string>();

  searchQuery: string = '';
  filters: CallFilter = {
    missed: false,
    registered: false
  };

  onFilterChange() {
    this.filterChange.emit(this.filters);
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }
}

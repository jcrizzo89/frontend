import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface ClientFilters {
  search: string;
  zone: string;
  bottleType: string;
  clientType: string;
  alerta: boolean | '';
  cantLlamadasMin: number | null;
  cantLlamadasMax: number | null;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

@Component({
  selector: 'app-client-filters',
  templateUrl: './client-filters.component.html',
  styleUrls: ['./client-filters.component.css']
})
export class ClientFiltersComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<ClientFilters>();

  filterForm: FormGroup;
  showAdvancedFilters = false;

  zones = ['14', '15', '16', '17', '18'];
  bottleTypes = ['Grande', 'Pequeño'];
  clientTypes = ['Bueno', 'Regular', 'Malo'];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      search: [''],
      zone: [''],
      bottleType: [''],
      clientType: [''],
      alerta: [''],
      cantLlamadasMin: [null],
      cantLlamadasMax: [null],
      dateRange: this.fb.group({
        start: [null],
        end: [null]
      })
    });
  }

  ngOnInit(): void {
    this.filterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(filters => this.filtersChanged.emit(filters));
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  clearFilters(): void {
    this.filterForm.reset();
  }
}

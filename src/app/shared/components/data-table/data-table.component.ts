import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface ColumnDefinition {
  key: string;
  header: string;
  type?: 'text' | 'date' | 'number' | 'custom';
  sortable?: boolean;
  width?: string;
  cellTemplate?: any; // TemplateRef para celdas personalizadas
}

export interface ActionButton {
  icon: string;
  tooltip: string;
  color?: 'primary' | 'accent' | 'warn';
  action: (row: any) => void;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  @Input() dataSource: any[] = [];
  @Input() columns: ColumnDefinition[] = [];
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [5, 10, 25, 100];
  @Input() showSearch = true;
  @Input() showActions = true;
  @Input() actionButtons: ActionButton[] = [];
  @Input() showCheckbox = false;
  @Input() showPagination = true;
  @Input() filters: {name: string, label: string, selected: boolean}[] = [];
  
  @Output() rowClick = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() filterChange = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<PageEvent>();
  
  displayedColumns: string[] = [];
  searchTerm = '';
  selectedRows = new Set<any>();
  
  ngOnInit() {
    this.updateDisplayedColumns();
  }
  
  ngOnChanges() {
    this.updateDisplayedColumns();
  }
  
  private updateDisplayedColumns() {
    const columns: string[] = [];
    
    if (this.showCheckbox) {
      columns.push('select');
    }
    
    columns.push(...this.columns.map(col => col.key));
    
    if (this.showActions && this.actionButtons.length > 0) {
      columns.push('actions');
    }
    
    this.displayedColumns = columns;
  }
  
  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterChange.emit(value);
  }
  
  onRowClick(row: any) {
    this.rowClick.emit(row);
  }
  
  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }
  
  toggleRowSelection(row: any) {
    if (this.selectedRows.has(row)) {
      this.selectedRows.delete(row);
    } else {
      this.selectedRows.add(row);
    }
    this.selectionChange.emit(Array.from(this.selectedRows));
  }
  
  toggleAllRows() {
    if (this.selectedRows.size === this.dataSource.length) {
      this.selectedRows.clear();
    } else {
      this.dataSource.forEach(row => this.selectedRows.add(row));
    }
    this.selectionChange.emit(Array.from(this.selectedRows));
  }
  
  isAllSelected() {
    return this.dataSource.length > 0 && this.selectedRows.size === this.dataSource.length;
  }
  
  isIndeterminate() {
    return this.selectedRows.size > 0 && this.selectedRows.size < this.dataSource.length;
  }
}

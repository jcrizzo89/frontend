import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Zona } from '../../../../core/models/zona.model';

@Component({
  selector: 'app-zona-list',
  templateUrl: './zona-list.component.html',
  styleUrls: ['./zona-list.component.css']
})
export class ZonaListComponent {
  @Input() set zonas(value: Zona[]) {
    this.dataSource.data = value || [];
  }
  
  @Input() isLoading = false;
  @Output() edit = new EventEmitter<Zona>();
  @Output() delete = new EventEmitter<Zona>();

  displayedColumns: string[] = ['zona', 'descripcion', 'acciones'];
  dataSource = new MatTableDataSource<Zona>([]);

  onEdit(zona: Zona): void {
    this.edit.emit(zona);
  }

  onDelete(zona: Zona): void {
    this.delete.emit(zona);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

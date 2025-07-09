import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

import { Zona } from './models/zona.model';
import { ZonasService } from './services/zonas.service';
import { ZonaEditComponent } from './components/zona-edit/zona-edit.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-zonas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './zonas.component.html',
  styleUrls: ['./zonas.component.css']
})
export class ZonasComponent implements OnInit {
  displayedColumns: string[] = ['zona', 'vehiculo', 'conductor', 'descripcion', 'coordenadas', 'editar'];
  dataSource = new MatTableDataSource<Zona>([]);
  selectedZona: Zona | null = null;

  isLoading = false;
  hasError = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private zonasService: ZonasService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadZonas();
  }

  loadZonas(): void {
    this.isLoading = true;
    this.hasError = false;

    this.zonasService.getZonas().subscribe({
      next: zonas => {
        this.dataSource.data = zonas;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error al cargar zonas:', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSelectZona(zona: Zona): void {
    this.selectedZona = zona;
  }

  openAddZonaDialog(): void {
    const dialogRef = this.dialog.open(ZonaEditComponent, {
      width: '650px',
      data: { zona: null, isNew: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadZonas();
      }
    });
  }

  openEditZonaDialog(zona: Zona): void {
    const dialogRef = this.dialog.open(ZonaEditComponent, {
      width: '650px',
      data: { zona, isNew: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadZonas();
      }
    });
  }

  getMapUrl(): string {
    if (!this.selectedZona) return '';
    // Ejemplo básico: usar coordenadas como parámetro de URL
    return `https://maps.googleapis.com/maps/api/staticmap?center=${this.selectedZona}&zoom=14&size=400x300&key=TU_API_KEY`;
  }
}

import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

import { Zona } from './models/zona.model';
import { ZonasService } from './services/zonas.service';

// Declaramos el componente de diálogo primero
@Component({
  selector: 'app-zona-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <div class="edit-zona-dialog">
      <h2 mat-dialog-title>{{dialogTitle}}</h2>
      
      <mat-dialog-content>
        <form [formGroup]="zonaForm">
          <div class="form-row">
            <div class="form-field">
              <mat-form-field appearance="outline">
                <mat-label>Zona</mat-label>
                <input matInput type="number" formControlName="id" readonly>
              </mat-form-field>
            </div>

            <div class="form-field">
              <mat-form-field appearance="outline">
                <mat-label>Vehículo</mat-label>
                <input matInput type="number" formControlName="vehiculo">
              </mat-form-field>
            </div>
          </div>

          <mat-form-field class="full-width" appearance="outline">
            <mat-label>Conductor</mat-label>
            <input matInput formControlName="conductor">
          </mat-form-field>

          <mat-form-field class="full-width" appearance="outline">
            <mat-label>Descripción</mat-label>
            <textarea matInput formControlName="descripcion" rows="3"></textarea>
          </mat-form-field>

          <mat-form-field class="full-width" appearance="outline">
            <mat-label>Coordenadas</mat-label>
            <input matInput formControlName="coordenadas">
          </mat-form-field>

          <div class="map-preview">
            <div class="map-label">Mapa zona</div>
            <div class="map-container">
              <img src="assets/images/map-placeholder.jpg" alt="Vista previa del mapa">
            </div>
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <a mat-button mat-dialog-close class="volver-link">« Volver</a>
        <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="zonaForm.invalid">Guardar cambios</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .edit-zona-dialog {
      max-width: 650px;
      padding: 0 10px;
    }

    .form-row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
    }

    .form-field {
      flex: 1;
    }

    .full-width {
      width: 100%;
    }

    .map-preview {
      margin-top: 16px;
    }

    .map-label {
      font-weight: 500;
      margin-bottom: 8px;
    }

    .map-container {
      border-radius: 8px;
      overflow: hidden;
      width: 200px;
      height: 150px;
      margin-bottom: 16px;
    }

    .map-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .volver-link {
      color: #666;
      margin-right: auto;
    }

    mat-dialog-actions {
      padding: 16px 0;
    }
  `]
})
export class ZonaEditDialogComponent implements OnInit {
  zonaForm!: FormGroup;
  isNew: boolean;
  dialogTitle: string;

  constructor(
    private fb: FormBuilder,
    private zonasService: ZonasService,
    public dialogRef: MatDialogRef<ZonaEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { zona: Zona | null, isNew: boolean }
  ) {
    this.isNew = data.isNew;
    this.dialogTitle = this.isNew ? 'Agregar nueva zona' : 'Editar zona';
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    const zona = this.data.zona || {
      id: 0,
      vehiculo: 0,
      conductor: '',
      descripcion: '',
      coordenadas: ''
    };

    this.zonaForm = this.fb.group({
      id: [zona.id],
      vehiculo: [zona.vehiculo, [Validators.required, Validators.min(1)]],
      conductor: [zona.conductor, Validators.required],
      descripcion: [zona.descripcion, Validators.required],
      coordenadas: [zona.coordenadas, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.zonaForm.valid) {
      const zona: Zona = this.zonaForm.value;

      if (this.isNew) {
        this.zonasService.addZona(zona).subscribe({
          next: (result) => {
            this.dialogRef.close(result);
          },
          error: (err) => console.error('Error al agregar zona:', err)
        });
      } else {
        this.zonasService.updateZona(zona).subscribe({
          next: (result) => {
            this.dialogRef.close(result);
          },
          error: (err) => console.error('Error al actualizar zona:', err)
        });
      }
    }
  }
}

// Luego declaramos el componente principal
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
    ZonaEditDialogComponent
  ],
  templateUrl: './zonas.component.html',
  styleUrls: ['./zonas.component.css']
})
export class ZonasComponent implements OnInit {
  displayedColumns: string[] = ['zona', 'vehiculo', 'conductor', 'descripcion', 'coordenadas', 'editar'];
  dataSource!: MatTableDataSource<Zona>;
  selectedZona: Zona | null = null;
  mapImageUrl: string = '';

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
    this.zonasService.getZonas().subscribe(zonas => {
      this.dataSource = new MatTableDataSource(zonas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSelectZona(zona: Zona): void {
    console.log('Zona seleccionada:', zona);
    this.selectedZona = zona;
  }

  getMapUrl(): string {
    return this.mapImageUrl || 'https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=13&size=600x300&maptype=roadmap';
  }

  openAddZonaDialog(): void {
    const dialogRef = this.dialog.open(ZonaEditDialogComponent, {
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
    const dialogRef = this.dialog.open(ZonaEditDialogComponent, {
      width: '650px',
      data: { zona, isNew: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadZonas();
        if (this.selectedZona && this.selectedZona.id === zona.id) {
          this.selectedZona = result;
        }
      }
    });
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { Zona } from '../../models/zona.model';
import { ZonasService } from '../../services/zonas.service';

@Component({
  selector: 'app-zona-edit',
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
  templateUrl: './zona-edit.component.html',
  styleUrl: './zona-edit.component.css'
})
export class ZonaEditComponent implements OnInit {
  zonaForm!: FormGroup;
  isNew: boolean;
  dialogTitle: string;

  constructor(
    private fb: FormBuilder,
    private zonasService: ZonasService,
    public dialogRef: MatDialogRef<ZonaEditComponent>,
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

  onCancel(): void {
    this.dialogRef.close();
  }
}

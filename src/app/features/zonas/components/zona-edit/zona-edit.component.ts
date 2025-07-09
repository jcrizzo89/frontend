import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { Zona, ZonaFormData } from '../../models/zona.model';
import { ZonaService } from '../../services/zona.service';

// Definir la interfaz para el valor del formulario
interface ZonaFormValue {
  idZona: string | null;
  zona: string;
  descripcion: string | null;
  activa: boolean;
  barrios: string[];
}

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
  zonaForm: FormGroup<{
    idZona: FormControl<string | null>;
    zona: FormControl<string>;
    descripcion: FormControl<string | null>;
    activa: FormControl<boolean>;
    barrios: FormControl<string[]>;
  }>;
  
  isNew: boolean = false;
  dialogTitle: string = '';



  constructor(
    private fb: FormBuilder,
    private zonaService: ZonaService,
    public dialogRef: MatDialogRef<ZonaEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { zona: Zona | null; isNew: boolean }
  ) {
    this.isNew = data.isNew;
    this.dialogTitle = this.isNew ? 'Agregar nueva zona' : 'Editar zona';
    
    // Inicializar el formulario con valores por defecto
    this.zonaForm = new FormGroup({
      idZona: new FormControl<string | null>(null),
      zona: new FormControl('', { 
        validators: [Validators.required, Validators.minLength(3)],
        nonNullable: true 
      }) as FormControl<string>,
      descripcion: new FormControl<string | null>(''),
      activa: new FormControl(true, { nonNullable: true }) as FormControl<boolean>,
      barrios: new FormControl<string[]>([], { nonNullable: true }) as FormControl<string[]>
    });
  }

  ngOnInit(): void {
    // Si estamos editando una zona existente, cargamos sus datos
    if (!this.isNew && this.data.zona) {
      this.loadZona(this.data.zona.idZona);
    }
  }

  loadZona(id: string): void {
    this.zonaService.getById(id).subscribe({
      next: (zona: Zona) => {
        this.zonaForm.patchValue({
          idZona: zona.idZona,
          zona: zona.zona,
          descripcion: zona.descripcion || '',
          activa: zona.activa,
          barrios: [...(zona.barrios || [])]
        } as ZonaFormValue);
      },
      error: (error: any) => {
        console.error('Error al cargar la zona:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.zonaForm.invalid) {
      this.markFormGroupTouched(this.zonaForm);
      return;
    }

    const formValue = this.zonaForm.getRawValue();
    const idZona = formValue.idZona;
    
    if (this.isNew || !idZona) {
      // Crear nueva zona
      const nuevaZona: ZonaFormData = {
        zona: formValue.zona,
        descripcion: formValue.descripcion || '',
        activa: formValue.activa,
        barrios: formValue.barrios || []
      };
      
      this.zonaService.create(nuevaZona).subscribe({
        next: (zona: Zona) => {
          this.dialogRef.close(zona);
        },
        error: (error: any) => {
          console.error('Error al crear la zona:', error);
        }
      });
    } else {
      // Actualizar zona existente
      const actualizarZona: Partial<ZonaFormData> = {
        zona: formValue.zona,
        descripcion: formValue.descripcion || '',
        activa: formValue.activa,
        barrios: formValue.barrios
      };
      
      this.zonaService.update(idZona, actualizarZona).subscribe({
        next: (zona: Zona) => {
          this.dialogRef.close(zona);
        },
        error: (error: any) => {
          console.error('Error al actualizar la zona:', error);
        }
      });
    }
  }
  
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ZonaService } from '../../../../core/services/zona.service';
import { Zona } from '../../../../core/models/zona.model';

@Component({
  selector: 'app-zona-form',
  templateUrl: './zona-form.component.html',
  styleUrls: ['./zona-form.component.css']
})
export class ZonaFormComponent implements OnInit {
  zonaForm: FormGroup;
  isEditing: boolean;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ZonaFormComponent>,
    private zonaService: ZonaService,
    @Inject(MAT_DIALOG_DATA) public data: { isEditing: boolean; zona?: Zona }
  ) {
    this.isEditing = data?.isEditing || false;
    this.zonaForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEditing && this.data.zona) {
      this.loadZonaData(this.data.zona);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      zona: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(500)]]
    });
  }

  private loadZonaData(zona: Zona): void {
    this.zonaForm.patchValue({
      zona: zona.zona,
      descripcion: zona.descripcion || ''
    });
  }

  onSubmit(): void {
    if (this.zonaForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    const formValue = this.zonaForm.value;
    const zonaData = {
      ...formValue,
      zona: formValue.zona.trim(),
      descripcion: formValue.descripcion?.trim() || null
    };

    const operation = this.isEditing && this.data.zona
      ? this.zonaService.update(this.data.zona.idZona, zonaData)
      : this.zonaService.create(zonaData);

    operation.subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error al guardar la zona:', error);
        this.error = 'Ocurrió un error al guardar la zona. Por favor, intente nuevamente.';
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

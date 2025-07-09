import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, Subscription, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Cliente, UbicacionCliente, ClienteFormData } from '../../models/client.model';
import { Zona } from '../../../../core/models/zona.model';
import { ZonaService } from '../../../../core/services/zona.service';
import { ClientService } from '../../services/client.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit, OnDestroy {
  @Input() client: Cliente | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Cliente>();

  clientForm: FormGroup;
  isEditing = false;
  isLoading = false;
  zonas: Zona[] = [];
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private zonaService: ZonaService,
    private dialog: MatDialog
  ) {
    this.clientForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadZonas();
    
    if (this.client) {
      this.isEditing = true;
      this.loadClientData();
    } else {
      // Agregar una ubicación por defecto para nuevos clientes
      this.addUbicacion();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadZonas(): void {
    this.isLoading = true;
    this.subscriptions.add(
      this.zonaService.getAll().subscribe({
        next: (zonas) => {
          this.zonas = zonas;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar las zonas:', error);
          this.isLoading = false;
        }
      })
    );
  }

  private loadClientData(): void {
    if (!this.client) return;

    this.clientForm.patchValue({
      idCliente: this.client.idCliente,
      nombre: this.client.nombre,
      telefono: this.client.telefono,
      idZona: this.client.idZona,
      observaciones: this.client.observaciones,
      alerta: this.client.alerta,
      fIngreso: this.client.fIngreso ? new Date(this.client.fIngreso).toISOString().split('T')[0] : ''
    });
    
    // Cargar ubicaciones si existen
    const ubicacionesArray = this.clientForm.get('ubicaciones') as FormArray;
    ubicacionesArray.clear();
    
    if (this.client.ubicaciones && this.client.ubicaciones.length > 0) {
      this.client.ubicaciones.forEach(ubicacion => {
        ubicacionesArray.push(this.createUbicacionFormGroup(ubicacion));
      });
    } else {
      // Si no hay ubicaciones, agregar una por defecto
      this.addUbicacion();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      idCliente: [null],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      telefono: ['', [
        Validators.required, 
        Validators.pattern(/^[0-9]{4} [0-9]{6}$/),
        Validators.maxLength(11)
      ]],
      idZona: [null, Validators.required],
      observaciones: ['', Validators.maxLength(500)],
      alerta: [false],
      fIngreso: [new Date().toISOString().split('T')[0], Validators.required],
      ubicaciones: this.fb.array([])
    });
  }

  createUbicacionFormGroup(ubicacion?: Partial<UbicacionCliente>): FormGroup {
    return this.fb.group({
      idUbicacion: [ubicacion?.idUbicacion || null],
      descripcion: [
        ubicacion?.descripcion || '', 
        [Validators.required, Validators.maxLength(100)]
      ],
      latitud: [
        ubicacion?.latitud || null, 
        [Validators.required, Validators.min(-90), Validators.max(90)]
      ],
      longitud: [
        ubicacion?.longitud || null, 
        [Validators.required, Validators.min(-180), Validators.max(180)]
      ],
      linkMaps: [
        ubicacion?.linkMaps || '', 
        [Validators.pattern(/^https?:\/\/.+/)]
      ],
      activa: [ubicacion?.activa ?? true]
    });
  }

  get ubicacionesArray(): FormArray<FormGroup> {
    return this.clientForm.get('ubicaciones') as FormArray<FormGroup>;
  }

  addUbicacion(ubicacion?: Partial<UbicacionCliente>): void {
    this.ubicacionesArray.push(this.createUbicacionFormGroup(ubicacion));
  }

  removeUbicacion(index: number): void {
    if (this.ubicacionesArray.length <= 1) {
      return; // No permitir eliminar la última ubicación
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Eliminar Ubicación',
        message: '¿Está seguro de que desea eliminar esta ubicación?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ubicacionesArray.removeAt(index);
      }
    });
  }

  onSubmit(): void {
    if (this.clientForm.invalid || this.isLoading) {
      this.markFormGroupTouched(this.clientForm);
      return;
    }

    this.isLoading = true;
    const formValue = this.clientForm.value;
    
    // Preparar el objeto de ubicaciones
    const ubicaciones = formValue.ubicaciones.map((ubic: any) => ({
      idUbicacion: ubic.idUbicacion || undefined,
      descripcion: ubic.descripcion.trim(),
      latitud: parseFloat(ubic.latitud),
      longitud: parseFloat(ubic.longitud),
      linkMaps: ubic.linkMaps?.trim() || undefined,
      activa: ubic.activa !== false // Por defecto true si no está definido
    }));

    // Crear un objeto con los datos del cliente asegurando que los campos requeridos estén presentes
    const clienteData: ClienteFormData = {
      nombre: formValue.nombre.trim(),
      telefono: formValue.telefono.trim(),
      idZona: formValue.idZona,
      observaciones: formValue.observaciones?.trim(),
      alerta: Boolean(formValue.alerta),
      cantLlamadas: 0, // Valor por defecto para nuevos clientes
      fIngreso: formValue.fIngreso ? new Date(formValue.fIngreso) : new Date()
    };

    // Función para manejar la creación/actualización de ubicaciones
    const handleUbicaciones = (clienteId: string, ubicacionesData: any[]): Observable<UbicacionCliente[]> => {
      if (ubicacionesData.length === 0) {
        return of([]);
      }
      
      // Procesar cada ubicación secuencialmente
      const operations: Observable<UbicacionCliente>[] = ubicacionesData.map(ubic => {
        const ubicacionData = {
          ...ubic,
          idCliente: clienteId
        };
        
        if (ubic.idUbicacion) {
          // Actualizar ubicación existente
          return this.clientService.updateUbicacion(
            clienteId, 
            ubic.idUbicacion, 
            ubicacionData
          );
        } else {
          // Crear nueva ubicación
          const { idUbicacion, ...newUbicacion } = ubicacionData;
          return this.clientService.addUbicacion(clienteId, newUbicacion);
        }
      });
      
      // Ejecutar operaciones en paralelo
      return operations.length > 0 ? forkJoin(operations) : of([]);
    };

    // Si estamos editando un cliente existente
    if (this.isEditing && this.client?.idCliente) {
      const clienteId = this.client.idCliente;
      
      // Primero actualizamos el cliente
      this.clientService.update(clienteId, clienteData).pipe(
        // Luego manejamos las ubicaciones
        switchMap((updatedClient: Cliente) => 
          handleUbicaciones(clienteId, ubicaciones).pipe(
            map((ubicacionesActualizadas: UbicacionCliente[]) => updatedClient)
          )
        )
      ).subscribe({
        next: (savedClient: Cliente) => {
          this.saved.emit(savedClient);
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error al actualizar el cliente:', error);
          this.isLoading = false;
        }
      });
    } else {
      // Crear un nuevo cliente
      this.clientService.create(clienteData).pipe(
        // Luego creamos las ubicaciones
        switchMap((newClient: Cliente) => 
          handleUbicaciones(newClient.idCliente, ubicaciones).pipe(
            map((ubicacionesCreadas: UbicacionCliente[]) => newClient)
          )
        )
      ).subscribe({
        next: (savedClient: Cliente) => {
          this.saved.emit(savedClient);
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error al crear el cliente:', error);
          this.isLoading = false;
        }
      });
    }
  }

  onClose(): void {
    if (this.clientForm.pristine) {
      this.close.emit();
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Descartar cambios',
        message: '¿Está seguro de que desea salir? Se perderán los cambios no guardados.',
        confirmText: 'Salir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.close.emit();
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }
}

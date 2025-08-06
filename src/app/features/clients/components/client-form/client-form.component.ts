import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../../../shared/components/error-dialog/error-dialog.component';
import { Subscription } from 'rxjs';
import { Cliente, UbicacionCliente, ClienteFormData } from '../../models/client.model';
import { Zona } from '../../../../core/models/zona.model';
import { ZonaService } from '../../../../core/services/zona.service';
import { ClientService } from '../../services/client.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

interface ClientFormValue {
  idCliente?: string;
  nombre: string;
  codigoArea: string;
  telefono: string;
  idZona: string;
  domicilio: string;
  linkMaps?: string;
  tipoBotellon?: string;
  observaciones?: string;
  imagenReferencia?: string | File;
  alerta: boolean;
  cantLlamadas: number;
  fIngreso?: Date;
  ubicaciones: FormArray;
  imagenUrl?: string;
}

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit, OnDestroy {
  @Input() client: Cliente | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Cliente>();

  clientForm: FormGroup<{
    idCliente: FormControl<string | null>;
    nombre: FormControl<string | null>;
    codigoArea: FormControl<string | null>;
    telefono: FormControl<string | null>;
    idZona: FormControl<string | null>;
    domicilio: FormControl<string | null>;
    linkMaps: FormControl<string | null>;
    tipoBotellon: FormControl<string | null>;
    observaciones: FormControl<string | null>;
    imagenReferencia: FormControl<File | string | null>;
    alerta: FormControl<boolean>;
    cantLlamadas: FormControl<number>;
    fIngreso: FormControl<Date | null>;
    ubicaciones: FormArray;
    imagenUrl: FormControl<string | null>;
  }>;
  
  isEditing = false;
  isLoading = false;
  zonas: Zona[] = [];
  clientAddresses: UbicacionCliente[] = [];
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
      this.loadClientAddresses();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onClose(): void {
    this.close.emit();
  }

  /**
   * Loads the client's saved addresses
   */
  private loadClientAddresses(): void {
    if (!this.client?.idCliente) return;
    
    this.isLoading = true;
    this.subscriptions.add(
      this.clientService.getClientAddresses(this.client.idCliente).subscribe({
        next: (addresses) => {
          this.clientAddresses = addresses;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading client addresses:', error);
          this.isLoading = false;
        }
      })
    );
  }

  /**
   * Handles address selection from the dropdown
   * @param event The selection change event
   */
  onAddressSelect(event: any): void {
    const selectedAddress = this.clientAddresses.find(addr => addr.idUbicacion === event.value);
    if (selectedAddress) {
      // Update the domicilio field with the selected address description
      this.clientForm.patchValue({
        domicilio: selectedAddress.descripcion,
        linkMaps: selectedAddress.linkMaps || ''
      });

      // If there's a map link, update it as well
      if (selectedAddress.linkMaps) {
        this.clientForm.get('linkMaps')?.setValue(selectedAddress.linkMaps);
      }
    }
  }

  get ubicacionesArray(): FormArray {
    return this.clientForm.get('ubicaciones') as FormArray;
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

  private createForm(): FormGroup {
    return this.fb.group({
      idCliente: [null as string | null],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      codigoArea: ['', [Validators.required, Validators.pattern(/^\d{2,4}$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{6,12}$/)]],
      idZona: [null as string | null, Validators.required],
      domicilio: ['', Validators.required],
      linkMaps: [''],
      tipoBotellon: [''],
      observaciones: [''],
      imagenReferencia: [null as File | string | null],
      alerta: [false],
      cantLlamadas: [0],
      fIngreso: [new Date()],
      ubicaciones: this.fb.array<FormGroup>([]),
      imagenUrl: [null as string | null]
    });
  }

  private atLeastOneUbicacionValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: boolean} | null => {
      const ubicaciones = control as FormArray;
      return ubicaciones.length > 0 ? null : { 'atLeastOneUbicacion': true };
    };
  }

  private createUbicacionFormGroup(ubicacion?: Partial<UbicacionCliente>): FormGroup {
    return this.fb.group({
      idUbicacion: [ubicacion?.idUbicacion || null],
      descripcion: [
        ubicacion?.descripcion || '', 
        [
          Validators.required, 
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s,.-]+$/)
        ]
      ],
      latitud: [
        ubicacion?.latitud || null, 
        [
          Validators.required,
          Validators.min(-90),
          Validators.max(90),
          Validators.pattern(/^-?\d{1,3}(\.\d+)?$/)
        ]
      ],
      longitud: [
        ubicacion?.longitud || null, 
        [
          Validators.required,
          Validators.min(-180),
          Validators.max(180),
          Validators.pattern(/^-?\d{1,3}(\.\d+)?$/)
        ]
      ],
      linkMaps: [
        ubicacion?.linkMaps || '', 
        [Validators.pattern(/^https?:\/\/.+/)]
      ],
      activa: [ubicacion?.activa !== false],
      idCliente: [this.client?.idCliente || '']
    });
  }

  addUbicacion(ubicacion?: Partial<UbicacionCliente>): void {
    this.ubicacionesArray.push(this.createUbicacionFormGroup(ubicacion));
  }

  removeUbicacion(index: number): void {
    if (this.ubicacionesArray.length <= 1) {
      return; // No permitir eliminar la última ubicación
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Ubicación',
        message: '¿Está seguro de que desea eliminar esta ubicación?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    this.subscriptions.add(
      dialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.ubicacionesArray.removeAt(index);
        }
      })
    );
  }

  openLink(url: string | null | undefined): void {
    if (url) {
      // Ensure the URL has a protocol
      const formattedUrl = url.startsWith('http://') || url.startsWith('https://') 
        ? url 
        : `https://${url}`;
      window.open(formattedUrl, '_blank', 'noopener,noreferrer');
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        this.dialog.open(ErrorDialogComponent, {
          data: {
            title: 'Error',
            message: 'Formato de archivo no válido. Por favor, seleccione una imagen JPG o PNG.',
            type: 'error'
          }
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.dialog.open(ErrorDialogComponent, {
          data: {
            title: 'Error',
            message: 'La imagen es demasiado grande. El tamaño máximo permitido es 5MB.',
            type: 'error'
          }
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Guardar el archivo en el formulario y mostrar la vista previa
        this.clientForm.patchValue({
          imagenReferencia: file,
          imagenUrl: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.clientForm.patchValue({
      imagenReferencia: null,
      imagenUrl: null
    });
  }

  private prepareFormData(): Partial<Cliente> {
    const formValue = this.clientForm.getRawValue();
    
    // Combinar código de área y teléfono
    const telefonoCompleto = `+54${formValue.codigoArea}${formValue.telefono}`;
    
    // Preparar ubicaciones
    const ubicaciones = formValue.ubicaciones.map((ubicacion: any) => ({
      ...ubicacion,
      idUbicacion: ubicacion.idUbicacion || undefined,
      latitud: parseFloat(ubicacion.latitud) || 0,
      longitud: parseFloat(ubicacion.longitud) || 0,
      activa: ubicacion.activa !== false
    }));
    
    // Crear objeto de datos del cliente
    const clienteData: any = {
      nombre: formValue.nombre || '',
      telefono: telefonoCompleto,
      idZona: formValue.idZona || '',
      domicilio: formValue.domicilio || '',
      linkMaps: formValue.linkMaps || undefined,
      tipoBotellon: formValue.tipoBotellon || undefined,
      observaciones: formValue.observaciones || undefined,
      alerta: formValue.alerta || false,
      cantLlamadas: formValue.cantLlamadas || 0,
      fIngreso: formValue.fIngreso || new Date(),
      ubicaciones: ubicaciones
    };
    
    // Solo incluir imagenReferencia si es un string (URL)
    if (formValue.imagenReferencia && typeof formValue.imagenReferencia === 'string') {
      clienteData.imagenReferencia = formValue.imagenReferencia;
    }
    
    return clienteData as Partial<Cliente>;
  }

  private loadClientData(): void {
    if (!this.client) return;

    // Extraer código de área del teléfono si existe (asumiendo formato: '+543511234567')
    let codigoArea = '';
    let telefonoNumero = this.client.telefono || '';
    
    // Si el teléfono comienza con +54, extraer el código de área
    if (telefonoNumero.startsWith('+54')) {
      const numeroSinCodigoPais = telefonoNumero.substring(3);
      // Tomar los primeros 2-4 dígitos como código de área
      const codigoAreaLength = Math.min(4, Math.max(2, numeroSinCodigoPais.length - 6));
      codigoArea = numeroSinCodigoPais.substring(0, codigoAreaLength);
      telefonoNumero = numeroSinCodigoPais.substring(codigoAreaLength);
    }

    // Preparar los datos del formulario
    const formData: any = {
      idCliente: this.client.idCliente,
      nombre: this.client.nombre,
      codigoArea: codigoArea,
      telefono: telefonoNumero,
      idZona: this.client.idZona,
      domicilio: this.client.domicilio || '',
      linkMaps: this.client.linkMaps || '',
      tipoBotellon: this.client.tipoBotellon || '',
      observaciones: this.client.observaciones || '',
      imagenReferencia: this.client.imagenReferencia || null,
      alerta: this.client.alerta || false,
      cantLlamadas: this.client.cantLlamadas || 0,
      fIngreso: this.client.fIngreso ? new Date(this.client.fIngreso) : new Date()
    };

    // Si hay una imagen de referencia, establecer la URL de la imagen
    if (this.client.imagenReferencia) {
      formData.imagenUrl = this.client.imagenReferencia;
    }

    this.clientForm.patchValue(formData);
    
    // Cargar ubicaciones si existen
    const ubicacionesArray = this.ubicacionesArray;
    ubicacionesArray.clear();
    
    if (this.client.ubicaciones && this.client.ubicaciones.length > 0) {
      this.client.ubicaciones.forEach(ubicacion => {
        ubicacionesArray.push(this.createUbicacionFormGroup(ubicacion));
      });
    } else {
      // Agregar una ubicación vacía por defecto
      this.addUbicacion();
    }
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach((control: AbstractControl) => {
      control.markAsTouched();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      this.markFormGroupTouched(this.clientForm);
      return;
    }

    const clienteData = this.prepareFormData();
    this.isLoading = true;
    
    // Determinar si es una actualización o creación
    const isUpdate = this.isEditing && this.client?.idCliente;
    const request = isUpdate && this.client?.idCliente
      ? this.clientService.update(this.client.idCliente, clienteData)
      : this.clientService.create(clienteData as Omit<Cliente, 'idCliente'>);

    this.subscriptions.add(
      request.subscribe({
        next: (savedClient: Cliente) => {
          this.isLoading = false;
          this.saved.emit(savedClient);
          
          // Mostrar mensaje de éxito
          this.dialog.open(ErrorDialogComponent, {
            data: {
              title: 'Éxito',
              message: `Cliente ${isUpdate ? 'actualizado' : 'creado'} correctamente`,
              type: 'success'
            },
            disableClose: true
          });
        },
        error: (error: any) => {
          console.error('Error al guardar el cliente:', error);
          this.isLoading = false;
          
          // Mostrar mensaje de error
          const errorMessage = error.error?.message || 'Ocurrió un error al guardar el cliente. Por favor, intente nuevamente.';
          
          this.dialog.open(ErrorDialogComponent, {
            width: '400px',
            data: {
              title: 'Error',
              message: errorMessage,
              type: 'error'
            },
            disableClose: true
          });
        }
      })
    );
  }

  getErrorMessage(controlName: string): string {
    const control = this.clientForm.get(controlName);
    if (!control || !control.errors) return '';

    if (control.hasError('required')) {
      return 'Este campo es obligatorio';
    } else if (control.hasError('pattern')) {
      if (controlName === 'codigoArea') {
        return 'Debe contener entre 2 y 4 dígitos';
      } else if (controlName === 'telefono') {
        return 'Debe contener entre 6 y 12 dígitos';
      } else if (controlName === 'nombre') {
        return 'Solo se permiten letras y espacios';
      } else if (controlName === 'latitud' || controlName === 'longitud') {
        return 'Formato de coordenada inválido';
      } else if (controlName === 'linkMaps') {
        return 'Debe ser una URL válida (comenzando con http:// o https://)';
      }
      return 'Formato inválido';
    } else if (control.hasError('minlength')) {
      return `Mínimo ${control.errors['minlength']?.requiredLength || 'requerido'} caracteres`;
    } else if (control.hasError('maxlength')) {
      return `Máximo ${control.errors['maxlength']?.requiredLength || 'requerido'} caracteres`;
    } else if (control.hasError('min') || control.hasError('max')) {
      if (controlName === 'latitud') {
        return 'La latitud debe estar entre -90 y 90 grados';
      } else if (controlName === 'longitud') {
        return 'La longitud debe estar entre -180 y 180 grados';
      }
      return 'Valor fuera de rango';
    } else if (control.hasError('email')) {
      return 'Formato de correo electrónico inválido';
    } else if (control.hasError('atLeastOneUbicacion')) {
      return 'Debe agregar al menos una ubicación';
    }
    
    return 'Campo inválido';
  }
}

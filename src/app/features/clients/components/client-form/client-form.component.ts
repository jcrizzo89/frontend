import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../../../shared/components/error-dialog/error-dialog.component';
import { Observable, of, Subscription, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Cliente, UbicacionCliente } from '../../models/client.model';
import { Zona } from '../../../../core/models/zona.model';
import { ZonaService } from '../../../../core/services/zona.service';
import { ClientService } from '../../services/client.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';


export interface ClienteFormData {
  nombre: string;
  codigoArea: string;
  telefono: string;
  domicilio: string;
  linkMaps?: string;
  tipoBotellon: string;
  imagenReferencia?: any;
  ubicaciones?: UbicacionCliente[];
  idZona: string;
  observaciones?: string;
  alerta: boolean;
  cantLlamadas: number;
  fIngreso: Date;
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
    }
    // No agregamos ubicación por defecto, solo se agregará cuando el usuario haga clic en "Agregar domicilio"
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

    // Extraer código de área del teléfono si existe (asumiendo formato: '+543511234567')
    let codigoArea = '';
    let telefonoNumero = this.client.telefono || '';

    // Si el teléfono comienza con +54, extraer el código de área (próximos dígitos después de +54)
    if (telefonoNumero.startsWith('+54')) {
      const numeroSinCodigoPais = telefonoNumero.substring(3);
      // Tomar los primeros 2-4 dígitos como código de área
      const codigoAreaLength = Math.min(4, Math.max(2, numeroSinCodigoPais.length - 6));
      codigoArea = numeroSinCodigoPais.substring(0, codigoAreaLength);
      telefonoNumero = numeroSinCodigoPais.substring(codigoAreaLength);
    }

    this.clientForm.patchValue({
      idCliente: this.client.idCliente,
      nombre: this.client.nombre,
      codigoArea: codigoArea,
      telefono: telefonoNumero,
      idZona: this.client.idZona,
      observaciones: this.client.observaciones || '',
      alerta: this.client.alerta || false
    });

    // Cargar ubicaciones si existen
    const ubicacionesArray = this.clientForm.get('ubicaciones') as FormArray;
    ubicacionesArray.clear();

    if (this.client.ubicaciones && this.client.ubicaciones.length > 0) {
      this.client.ubicaciones.forEach(ubicacion => {
        ubicacionesArray.push(this.createUbicacionFormGroup(ubicacion));
      });
    }
    // No agregamos ubicación por defecto, solo se agregará cuando el usuario haga clic en "Agregar domicilio"
  }

  // Validador personalizado para el archivo de imagen
  private imageValidator(control: FormControl): { [key: string]: any } | null {
    if (!control.value) return null;
    const file = control.value;
    if (file instanceof File) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        return { invalidFileType: true };
      }
      // Tamaño máximo de 5MB
      if (file.size > 5 * 1024 * 1024) {
        return { fileTooLarge: true };
      }
    }
    return null;
  }

  // Validador para requerir al menos una ubicación
  private atLeastOneUbicacion(control: AbstractControl): { [key: string]: boolean } | null {
    const ubicaciones = control as FormArray;
    return ubicaciones.length > 0 ? null : { required: true };
  }

  createForm(): FormGroup {
    return this.fb.group({
      idCliente: [null],
      nombre: ['', [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      codigoArea: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{2,4}$')
      ]],
      telefono: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{6,12}$')
      ]],
      domicilio: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200)
      ]],
      linkMaps: ['', [
        Validators.pattern(/^(https?:\/\/)?(www\.)?(google\.com\/maps|goo\.gl\/maps|maps\.app\.goo\.gl)/)
      ]],
      tipoBotellon: ['', [
        Validators.required
      ]],
      imagenReferencia: [null],
      // Inicializamos el array de ubicaciones vacío
      ubicaciones: this.fb.array([], {
        validators: [
          (control: AbstractControl) => this.atLeastOneUbicacion(control)
        ]
      }),
      idZona: ['', Validators.required],
      observaciones: [''],
      alerta: [false],
      cantLlamadas: [0],
      fIngreso: [new Date()] // Store as Date object
    }, { updateOn: 'blur' });
  }

  createUbicacionFormGroup(ubicacion?: Partial<UbicacionCliente>): FormGroup {
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
      activa: [ubicacion?.activa !== false]
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
      disableClose: true,
      data: {
        title: 'Eliminar Ubicación',
        message: '¿Está seguro de que desea eliminar esta ubicación?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

<<<<<<< Updated upstream
    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.close.emit();
=======
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.ubicacionesArray.removeAt(index);
>>>>>>> Stashed changes
      }
    });
  }


  onSubmit(): void {
    // Forzar la validación de todos los controles
    this.markFormGroupTouched(this.clientForm);

    // Verificar si el formulario es válido
    if (this.clientForm.invalid) {
      console.warn('Formulario inválido. No se puede guardar.');
      this.logFormErrors();
      return;
    }

    if (this.isLoading) {
      console.warn('Ya se está procesando una solicitud');
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

    // Preparar el objeto con los datos del cliente
    const clienteData: ClienteFormData = {
      nombre: formValue.nombre.trim(),
      codigoArea: formValue.codigoArea.trim(),
      telefono: formValue.telefono.trim(),
      domicilio: formValue.domicilio.trim(),
      linkMaps: formValue.linkMaps?.trim() || undefined,
      tipoBotellon: formValue.tipoBotellon,
      imagenReferencia: formValue.imagenReferencia || undefined,
      idZona: formValue.idZona,
      observaciones: formValue.observaciones?.trim() || undefined,
      alerta: Boolean(formValue.alerta),
      cantLlamadas: formValue.cantLlamadas || 0,
      // Asegurarse de que fIngreso sea un objeto Date
      fIngreso: formValue.fIngreso instanceof Date ? formValue.fIngreso : new Date()
    };

    // Limpiar el objeto: eliminar propiedades undefined, null o vacías
    const cleanObject = (obj: any) => {
      Object.keys(obj).forEach(key => {
        // Asegurarse de que fIngreso sea un objeto Date
        if (key === 'fIngreso') {
          if (obj[key] && !(obj[key] instanceof Date)) {
            obj[key] = new Date(obj[key]);
          }
          return; // Mantener el campo fIngreso
        }

        if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
          delete obj[key];
        } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          cleanObject(obj[key]); // Limpiar objetos anidados
        }
      });
      return obj;
    };

    // Aplicar limpieza al objeto de datos
    cleanObject(clienteData);

    console.log('Datos del cliente a enviar:', JSON.stringify(clienteData, null, 2));

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
          let errorMessage = 'Ocurrió un error al actualizar el cliente.';

          if (error.status === 400) {
            errorMessage = 'Error de validación: ';
            if (error.error && error.error.message) {
              errorMessage += error.error.message;
              // Si el formulario ha sido modificado, mostramos un diálogo de confirmación
              const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                width: '350px',
                data: {
                  title: 'Descartar cambios',
                  message: '¿Está seguro de que desea salir? Se perderán los cambios no guardados.',
                  confirmText: 'Salir',
                  cancelText: 'Cancelar'
                },
                disableClose: true // Evitar que el diálogo se cierre haciendo clic fuera
              });

              const dialogSubscription = dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  this.close.emit();
                }
<<<<<<< Updated upstream
              });                             // ← Cierra el subscribe() del diálogo
            }
          }                                   // ← Cierra el if (error.status === 400)
        }                                     // ← Cierra el callback error: (…) => { …
      });
      // Método para abrir enlaces
      openLink(url: string): void {
        if(url) {
          window.open(url, '_blank');
        }
      }

      // Método para manejar la selección de archivos
      onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if(input.files && input.files.length > 0) {
        const file = input.files[0];
        if (file) {
          this.clientForm.patchValue({
            imagenReferencia: file
          });
        }
=======
              });               // ← 1) cierra el subscribe() del diálogo
            }                     // ← 2) cierra el if(error.error && ...)
          }                       // ← 3) cierra el if(error.status === 400)
        }                         // ← 4) cierra el callback error: (error) => { …
      });                         // ← 5) cierra el subscribe() principal
    }
  }
  // Método para abrir enlaces
  openLink(url: string): void {
    if (url) {
      const full = url.startsWith('http') ? url : `https://${url}`;
      window.open(full, '_blank');
    }
  }





  // Método para manejar la selección de archivos
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file) {
        this.clientForm.patchValue({
          imagenReferencia: file
        });
>>>>>>> Stashed changes
      }
    }

<<<<<<< Updated upstream
    // Método para eliminar la imagen seleccionada
    removeImage(): void {
      this.clientForm.patchValue({
        imagenReferencia: null
      });
    }

    // Método para abrir enlaces en una nueva pestaña
    openLink(url: string): void {
      if(url) {
        // Asegurarse de que la URL tenga el protocolo https
        if (!url.match(/^https?:\/\//i)) {
          url = 'https://' + url;
        }
        window.open(url, '_blank');
      }
    }

    // Método para abrir enlaces en una nueva pestaña
    openLink(url: string): void {
      if(url) {
        // Asegurarse de que la URL tenga el protocolo https
        if (!url.match(/^https?:\/\//i)) {
          url = 'https://' + url;
        }
        window.open(url, '_blank');
      }
    }
=======
  // Método para eliminar la imagen seleccionada
  removeImage(): void {
    this.clientForm.patchValue({
      imagenReferencia: null
    });
  }


>>>>>>> Stashed changes

  // Método para marcar todos los controles del formulario como touched
  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Método para depuración
  private logFormErrors(): void {
    Object.keys(this.clientForm.controls).forEach(key => {
      const control = this.clientForm.get(key);
      if (control?.errors) {
        console.log('Control:', key, 'Errors:', control.errors);
      }
    });
  }

  // Método para guardar el cliente
  private saveClient(): void {
    if (this.clientForm.invalid) {
      this.markFormGroupTouched(this.clientForm);
      return;
    }

    this.isLoading = true;

    // Obtener los valores del formulario
    const formValue = this.clientForm.value;

    // Preparar los datos para enviar al backend
    const clienteData: any = {
      nombre: formValue.nombre,
      telefono: `+54${formValue.codigoArea}${formValue.telefono}`,
      idZona: formValue.idZona,
      observaciones: formValue.observaciones || '',
      alerta: formValue.alerta || false
    };

    // Si hay ubicaciones, agregarlas al objeto
    if (formValue.ubicaciones && formValue.ubicaciones.length > 0) {
      clienteData.ubicaciones = formValue.ubicaciones.map((ubicacion: any) => ({
        idUbicacion: ubicacion.idUbicacion || undefined,
        descripcion: ubicacion.descripcion,
        latitud: parseFloat(ubicacion.latitud) || 0,
        longitud: parseFloat(ubicacion.longitud) || 0,
        linkMaps: ubicacion.linkMaps || '',
        activa: ubicacion.activa !== false
      }));
    }

    // Determinar si hay una imagen para enviar
<<<<<<< Updated upstream
    const hasImage = formValue.imagenReferencia && formValue.imagenReferencia instanceof File;

    // Realizar la petición al servidor
=======
    // Determinar si hay una imagen para enviar
    const hasImage = formValue.imagenReferencia instanceof File;

    // Declaramos aquí la variable
>>>>>>> Stashed changes
    let request: Observable<Cliente>;

    if (hasImage) {
      // Si hay imagen, armo un FormData
      const formData = new FormData();
      formData.append('cliente', JSON.stringify(clienteData));
<<<<<<< Updated upstream
      formData.append('imagen', formValue.imagenReferencia);
=======
      formData.append('imagen', formValue.imagenReferencia!);
>>>>>>> Stashed changes

      if (this.isEditing && this.client?.idCliente) {
        // Si es edición y hay imagen: casteo a any para saltar TS2559
        request = this.clientService.update(
          this.client.idCliente,
          formData as any
        );
      } else {
        // Si es creación y hay imagen
        request = this.clientService.create(
          formData as any
        );
      }

    } else {
      // Sin imagen, uso el objeto plano clienteData
      if (this.isEditing && this.client?.idCliente) {
        request = this.clientService.update(this.client.idCliente, clienteData);
      } else {
        request = this.clientService.create(clienteData);
      }
    }

    // Ahora request está siempre inicializado
    this.subscriptions.add(
      request.subscribe({
        next: savedClient => {
          this.isLoading = false;
          this.saved.emit(savedClient);
<<<<<<< Updated upstream
=======
          // ... resto de tu lógica de éxito
        },
        error: error => {
          this.isLoading = false;
          this.saved.emit(savedClient);
>>>>>>> Stashed changes

          // Mostrar mensaje de éxito
          this.dialog.open(ErrorDialogComponent, {
            width: '400px',
            data: {
              title: 'Éxito',
              message: `Cliente ${this.isEditing ? 'actualizado' : 'creado'} correctamente.`,
              isSuccess: true
            }
          });
        },
        error: (error) => {
          console.error('Error al guardar el cliente:', error);
          this.isLoading = false;

          // Mostrar mensaje de error
          let errorMessage = 'Ocurrió un error al guardar el cliente.';

          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 400) {
            errorMessage = 'Los datos enviados no son válidos.';
          } else if (error.status === 404) {
            errorMessage = 'No se encontró el recurso solicitado.';
          } else if (error.status >= 500) {
            errorMessage = 'Error en el servidor. Por favor, intente nuevamente más tarde.';
          }

          this.dialog.open(ErrorDialogComponent, {
            width: '400px',
            data: {
              title: 'Error',
              message: errorMessage
            }
          });
        }
      })
    );
  }

  /**
   * Obtiene el mensaje de error para un campo del formulario
   */
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
      }
      return 'Formato inválido';
    } else if (control.hasError('minlength')) {
      return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    } else if (control.hasError('maxlength')) {
      return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    } else if (control.hasError('min')) {
      return `El valor mínimo es ${control.errors['min'].min}`;
    } else if (control.hasError('max')) {
      return `El valor máximo es ${control.errors['max'].max}`;
    } else if (control.hasError('email')) {
      return 'Formato de correo electrónico inválido';
    } else if (control.hasError('invalidFileType')) {
      return 'Tipo de archivo no soportado (solo JPG, PNG)';
    } else if (control.hasError('fileTooLarge')) {
      return 'El archivo es demasiado grande (máx. 5MB)';
    }

    return 'Campo inválido';
  }

  onClose(): void {
    this.close.emit();
  }


}

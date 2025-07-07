import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {
  @Input() client: any;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<any>();

  clientForm: FormGroup;
  isEditing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService
  ) {
    this.clientForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.client) {
      this.isEditing = true;
      this.clientForm.patchValue({
        nombre: this.client.nombre,
        telefono: this.client.telefono,
        domicilio: this.client.domicilio,
        observaciones: this.client.observaciones,
        zona: this.client.zona?.id || '',
        tipoBotellon: this.client.tipoBotellon,
        tipoCliente: this.client.tipoCliente,
        alerta: this.client.alerta,
        cantLlamadas: this.client.cantLlamadas,
        fIngreso: this.client.fIngreso?.split('T')[0] || '', // para input type="date"
        latitudEntrega: this.client.latitudEntrega,
        longitudEntrega: this.client.longitudEntrega,
        linkMaps: this.client.linkMaps
      });
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{4} [0-9]{6}$')]],
      domicilio: ['', Validators.required],
      observaciones: [''],
      zona: ['', Validators.required],
      tipoBotellon: ['', Validators.required],
      tipoCliente: ['', Validators.required],
      alerta: [false, Validators.required],
      cantLlamadas: [0, [Validators.required, Validators.min(0)]],
      fIngreso: ['', Validators.required],
      latitudEntrega: ['', Validators.required],
      longitudEntrega: ['', Validators.required],
      linkMaps: ['', Validators.pattern(/^https?:\/\/.*$/)]
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const clientData = this.clientForm.value;

      if (this.isEditing) {
        this.clientService.updateClient(this.client.id, clientData)
          .subscribe(updatedClient => {
            this.saved.emit(updatedClient);
            this.onClose();
          });
      } else {
        this.clientService.createClient(clientData)
          .subscribe(newClient => {
            this.saved.emit(newClient);
            this.onClose();
          });
      }
    }
  }

  onClose(): void {
    this.close.emit();
  }
}

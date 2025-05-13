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
      this.clientForm.patchValue(this.client);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      photo: [''],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{4} [0-9]{6}$')]],
      name: ['', Validators.required],
      address: ['', Validators.required],
      mapLink: [''],
      observations: [''],
      zone: ['', Validators.required],
      bottleType: ['Grande', Validators.required],
      type: ['Bueno', Validators.required]
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

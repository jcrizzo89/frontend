import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientListComponent } from '../../components/client-list/client-list.component';
import { ClientFilters } from '../../components/client-filters/client-filters.component';
import { Client } from '../../models/client.model';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-clients-page',
  templateUrl: './clients-page.component.html',
  styleUrls: ['./clients-page.component.css']
})
export class ClientsPageComponent implements OnInit {
  @ViewChild(ClientListComponent) clientList!: ClientListComponent;

  showClientForm = false;
  selectedClient: Client | null = null;

  constructor(
    private clientService: ClientService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onAddClient(): void {
    this.selectedClient = null;
    this.showClientForm = true;
  }

  onEditClient(client: Client): void {
    this.selectedClient = client;
    this.showClientForm = true;
  }

  onCloseForm(): void {
    this.showClientForm = false;
    this.selectedClient = null;
  }

  onClientSaved(client: Client): void {
    const wasEditing = !!this.selectedClient;

    this.showClientForm = false;
    this.selectedClient = null;

    const message = wasEditing
      ? 'Cliente actualizado exitosamente'
      : 'Cliente creado exitosamente';

    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });

    // Recargar la lista de clientes
    this.clientList.loadClients();
  }

  onFiltersChanged(filters: ClientFilters): void {
    this.clientList.applyFilters(filters);
  }
}

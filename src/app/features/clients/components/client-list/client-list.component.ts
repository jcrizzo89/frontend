import { Component, OnInit, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ClientService } from '../../services/client.service';
import { ClientFilters } from '../client-filters/client-filters.component';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit, AfterViewInit {
  @Output() editClient = new EventEmitter<Client>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'nombre', 'telefono', 'zona', 'domicilio', 'fIngreso',
    'llamadas', 'pedidos', 'alerta', 'observaciones', 'actions'
  ];
  dataSource: MatTableDataSource<Client> = new MatTableDataSource<Client>();
  originalData: Client[] = [];

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe(clients => {
      this.originalData = clients;
      this.dataSource.data = clients;
    });
  }

  onEdit(client: Client): void {
    this.editClient.emit(client);
  }

  applyFilters(filters: ClientFilters): void {
    let filteredData = [...this.originalData];

    if (filters.search) {
      const term = filters.search.toLowerCase();
      filteredData = filteredData.filter(client =>
        client.nombre.toLowerCase().includes(term) ||
        client.telefono.toLowerCase().includes(term) ||
        (client.domicilio || '').toLowerCase().includes(term)
      );
    }

    if (filters.zone) {
      filteredData = filteredData.filter(client => client.zona === filters.zone);
    }

    if (filters.dateRange?.start || filters.dateRange?.end) {
      const start = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
      const end = filters.dateRange.end ? new Date(filters.dateRange.end) : null;

      filteredData = filteredData.filter(client => {
        const ingreso = client.fIngreso ? new Date(client.fIngreso) : null;
        if (!ingreso) return false;
        if (start && end) return ingreso >= start && ingreso <= end;
        if (start) return ingreso >= start;
        if (end) return ingreso <= end;
        return true;
      });
    }

    this.dataSource.data = filteredData;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

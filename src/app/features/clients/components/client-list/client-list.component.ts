import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
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
export class ClientListComponent implements OnInit {
  @Output() editClient = new EventEmitter<Client>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  displayedColumns: string[] = ['photo', 'contact', 'registrationDate', 'destination', 'zone', 'bottleType', 'history', 'clientType', 'details', 'actions'];
  dataSource: MatTableDataSource<Client>;
  originalData: Client[] = [];

  constructor(private clientService: ClientService) {
    this.dataSource = new MatTableDataSource<Client>([]);
  }

  ngOnInit(): void {
    this.loadClients();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadClients(): void {
    this.clientService.getClients().subscribe(clients => {
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
      const searchTerm = filters.search.toLowerCase();
      filteredData = filteredData.filter(client => 
        client.name.toLowerCase().includes(searchTerm) ||
        client.phone.toLowerCase().includes(searchTerm) ||
        client.address.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.zone) {
      filteredData = filteredData.filter(client => 
        client.zone === filters.zone
      );
    }

    if (filters.bottleType) {
      filteredData = filteredData.filter(client => 
        client.bottleType === filters.bottleType
      );
    }

    if (filters.clientType) {
      filteredData = filteredData.filter(client => 
        client.type === filters.clientType
      );
    }

    if (filters.dateRange?.start || filters.dateRange?.end) {
      const start = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
      const end = filters.dateRange.end ? new Date(filters.dateRange.end) : null;

      filteredData = filteredData.filter(client => {
        const clientDate = new Date(client.registrationDate);
        if (start && end) {
          return clientDate >= start && clientDate <= end;
        } else if (start) {
          return clientDate >= start;
        } else if (end) {
          return clientDate <= end;
        }
        return true;
      });
    }

    this.dataSource.data = filteredData;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:3001/clientes';

  constructor(private http: HttpClient) {}

  getAllClients(): Observable<Client[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((clients) => clients.map(c => this.mapClient(c)))
    );
  }

  getClientById(id: string): Observable<Client> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(client => this.mapClient(client))
    );
  }

  createClient(client: Partial<Client>): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  updateClient(id: string, client: Partial<Client>): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
  }

  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateClientLocation(id: string, latitud: number, longitud: number): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}/ubicacion`, { latitud, longitud });
  }

  private mapClient(c: any): Client {
    return {
      id: c.idCliente,
      nombre: c.nombre,
      telefono: c.telefono,
      observaciones: c.observaciones,
      alerta: c.alerta,
      cantLlamadas: c.cantLlamadas,
      fIngreso: c.fIngreso,
      domicilio: c.domicilio,
      zona: c.zona?.nombre || '',
      pedidos: c.pedidos?.length || 0,
      llamadas: c.llamadas?.length || 0,
      latitudEntrega: c.latitudEntrega,
      longitudEntrega: c.longitudEntrega
    };
  }
}

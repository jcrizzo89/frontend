import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente, UbicacionCliente, Llamada } from '../models/client.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los clientes
   */
  getAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  /**
   * Obtiene un cliente por su ID
   */
  getById(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo cliente
   */
  create(cliente: Omit<Cliente, 'idCliente'>): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  /**
   * Actualiza un cliente existente
   */
  update(id: string, cliente: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }

  /**
   * Elimina un cliente
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene las ubicaciones de un cliente
   */
  getUbicaciones(clienteId: string): Observable<UbicacionCliente[]> {
    return this.http.get<UbicacionCliente[]>(`${this.apiUrl}/${clienteId}/ubicaciones`);
  }

  /**
   * Agrega una nueva ubicación a un cliente
   */
  addUbicacion(clienteId: string, ubicacion: Omit<UbicacionCliente, 'idUbicacion' | 'idCliente'>): Observable<UbicacionCliente> {
    return this.http.post<UbicacionCliente>(`${this.apiUrl}/${clienteId}/ubicaciones`, ubicacion);
  }

  /**
   * Actualiza una ubicación de un cliente
   */
  updateUbicacion(clienteId: string, ubicacionId: string, ubicacion: Partial<UbicacionCliente>): Observable<UbicacionCliente> {
    return this.http.put<UbicacionCliente>(`${this.apiUrl}/${clienteId}/ubicaciones/${ubicacionId}`, ubicacion);
  }

  /**
   * Elimina una ubicación de un cliente
   */
  deleteUbicacion(clienteId: string, ubicacionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${clienteId}/ubicaciones/${ubicacionId}`);
  }

  /**
   * Obtiene el historial de llamadas de un cliente
   */
  getLlamadas(clienteId: string): Observable<Llamada[]> {
    return this.http.get<Llamada[]>(`${this.apiUrl}/${clienteId}/llamadas`);
  }

  /**
   * Registra una nueva llamada para un cliente
   */
  addLlamada(clienteId: string, llamada: Omit<Llamada, 'idLlamada' | 'idCliente'>): Observable<Llamada> {
    return this.http.post<Llamada>(`${this.apiUrl}/${clienteId}/llamadas`, llamada);
  }
}

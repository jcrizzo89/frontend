import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Zona } from '../models/zona.model';

@Injectable({
  providedIn: 'root'
})
export class ZonaService {
  private apiUrl = `${environment.apiUrl}/zonas`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las zonas disponibles
   */
  getAll(): Observable<Zona[]> {
    return this.http.get<Zona[]>(this.apiUrl);
  }

  /**
   * Obtiene una zona por su ID
   * @param id ID de la zona
   */
  getById(id: number): Observable<Zona> {
    return this.http.get<Zona>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea una nueva zona
   * @param zona Datos de la zona a crear
   */
  create(zona: Omit<Zona, 'idZona'>): Observable<Zona> {
    return this.http.post<Zona>(this.apiUrl, zona);
  }

  /**
   * Actualiza una zona existente
   * @param id ID de la zona a actualizar
   * @param cambios Cambios a aplicar a la zona
   */
  update(id: number, cambios: Partial<Zona>): Observable<Zona> {
    return this.http.put<Zona>(`${this.apiUrl}/${id}`, cambios);
  }

  /**
   * Elimina una zona
   * @param id ID de la zona a eliminar
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Zona } from '../models/zona.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZonasService {
  private apiUrl = `${environment.apiUrl}/zonas`;

  constructor(private http: HttpClient) {}

  getZonas(): Observable<Zona[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(zonas => zonas.map(z => this.mapZona(z)))
    );
  }

  getZonaById(id: string): Observable<Zona> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(z => this.mapZona(z))
    );
  }

  addZona(zona: Partial<Zona>): Observable<Zona> {
    return this.http.post<Zona>(this.apiUrl, zona);
  }

  updateZona(id: string, zona: Partial<Zona>): Observable<Zona> {
    return this.http.put<Zona>(`${this.apiUrl}/${id}`, zona);
  }

  deleteZona(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private mapZona(z: any): Zona {
    return {
      idZona: z.idZona || z.id, // Handle both idZona and id for backward compatibility
      zona: z.zona,
      descripcion: z.descripcion,
      activa: z.activa,
      barrios: z.barrios ?? [],
      fechaCreacion: z.fechaCreacion ? new Date(z.fechaCreacion) : new Date(),
      ultimaActualizacion: z.ultimaActualizacion ? new Date(z.ultimaActualizacion) : undefined
    };
  }
}

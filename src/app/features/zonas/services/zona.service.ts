import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Zona, ZonaFormData, ZonaStats, ZonaFilter } from '../models/zona.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZonaService {
  private apiUrl = `${environment.apiUrl}/zonas`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las zonas con filtros opcionales
   */
  getAll(): Observable<Zona[]> {
    return this.http.get<Zona[]>(this.apiUrl);
  }

  /**
   * Obtiene una zona por su ID
   */
  getById(id: string): Observable<Zona> {
    return this.http.get<Zona>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea una nueva zona
   */
  create(zona: ZonaFormData): Observable<Zona> {
    return this.http.post<Zona>(this.apiUrl, zona);
  }

  /**
   * Actualiza una zona existente
   */
  update(id: string, zona: Partial<ZonaFormData>): Observable<Zona> {
    return this.http.put<Zona>(`${this.apiUrl}/${id}`, zona);
  }

  /**
   * Elimina una zona
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Actualiza el estado de una zona (activa/inactiva)
   */
  updateEstado(id: string, activa: boolean): Observable<Zona> {
    return this.http.patch<Zona>(
      `${this.apiUrl}/${id}/estado`,
      { activa }
    );
  }

  /**
   * Asigna repartidores a una zona
   */
  asignarRepartidores(idZona: string, idRepartidores: string[]): Observable<Zona> {
    return this.http.post<Zona>(
      `${this.apiUrl}/${idZona}/repartidores`,
      { idRepartidores }
    );
  }

  /**
   * Obtiene estadísticas de las zonas
   */
  getEstadisticas(): Observable<ZonaStats> {
    return this.http.get<ZonaStats>(`${this.apiUrl}/estadisticas`);
  }

  /**
   * Obtiene los barrios disponibles en todas las zonas
   */
  getBarriosDisponibles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/barrios`);
  }

  /**
   * Verifica si un nombre de zona ya existe
   */
  checkNombreDisponible(nombre: string, idZonaExcluida?: string): Observable<{ disponible: boolean }> {
    const params: any = { nombre };
    if (idZonaExcluida) {
      params.excluir = idZonaExcluida;
    }
    return this.http.get<{ disponible: boolean }>(`${this.apiUrl}/check-nombre`, { params });
  }

  /**
   * Obtiene las zonas con repartidores disponibles
   */
  getZonasConRepartidoresDisponibles(): Observable<Zona[]> {
    return this.http.get<Zona[]>(`${this.apiUrl}/disponibles`);
  }

  /**
   * Obtiene las zonas filtradas
   */
  getZonasFiltradas(filtros: ZonaFilter): Observable<Zona[]> {
    return this.http.get<Zona[]>(this.apiUrl, { params: filtros as any });
  }

  /**
   * Exporta las zonas a un archivo Excel
   */
  exportToExcel(filters?: ZonaFilter): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/exportar`, {
      params: filters as any,
      responseType: 'blob'
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Repartidor, RepartidorFormData, RepartidorStats, RepartidorEstado, RepartidorEstadoSatelital } from '../models/repartidor.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RepartidorService {
  private apiUrl = `${environment.apiUrl}/repartidores`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los repartidores con filtros opcionales
   */
  getAll(filters?: {
    estado?: RepartidorEstado;
    estadoSatelital?: RepartidorEstadoSatelital;
    idZona?: string;
    search?: string;
  }): Observable<Repartidor[]> {
    let params: any = {};
    if (filters) {
      if (filters.estado && filters.estado !== 'Todos') params.estado = filters.estado;
      if (filters.estadoSatelital && filters.estadoSatelital !== 'Todos') params.estadoSatelital = filters.estadoSatelital;
      if (filters.idZona) params.idZona = filters.idZona;
      if (filters.search) params.search = filters.search;
    }
    return this.http.get<Repartidor[]>(this.apiUrl, { params });
  }

  /**
   * Obtiene un repartidor por su ID
   */
  getById(id: string): Observable<Repartidor> {
    return this.http.get<Repartidor>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo repartidor
   */
  create(repartidor: RepartidorFormData): Observable<Repartidor> {
    return this.http.post<Repartidor>(this.apiUrl, repartidor);
  }

  /**
   * Actualiza un repartidor existente
   */
  update(id: string, repartidor: Partial<RepartidorFormData>): Observable<Repartidor> {
    return this.http.put<Repartidor>(`${this.apiUrl}/${id}`, repartidor);
  }

  /**
   * Actualiza el estado de un repartidor
   */
  updateEstado(id: string, estado: Repartidor['estado']): Observable<Repartidor> {
    return this.http.patch<Repartidor>(
      `${this.apiUrl}/${id}/estado`,
      { estado }
    );
  }

  /**
   * Actualiza el estado satelital de un repartidor
   */
  updateEstadoSatelital(id: string, estadoSatelital: Repartidor['estadoSatelital']): Observable<Repartidor> {
    return this.http.patch<Repartidor>(
      `${this.apiUrl}/${id}/estado-satelital`,
      { estadoSatelital }
    );
  }

  /**
   * Obtiene las estadísticas de un repartidor
   */
  getEstadisticas(id: string, params?: {
    fechaInicio?: Date;
    fechaFin?: Date;
  }): Observable<RepartidorStats> {
    let queryParams: any = {};
    if (params) {
      if (params.fechaInicio) queryParams.fechaInicio = params.fechaInicio.toISOString();
      if (params.fechaFin) queryParams.fechaFin = params.fechaFin.toISOString();
    }
    
    return this.http.get<RepartidorStats>(
      `${this.apiUrl}/${id}/estadisticas`,
      { params: queryParams }
    );
  }

  /**
   * Obtiene los pedidos asignados a un repartidor
   */
  getPedidosAsignados(id: string, params?: {
    estado?: string;
    fechaInicio?: Date;
    fechaFin?: Date;
  }): Observable<any[]> {
    let queryParams: any = {};
    if (params) {
      if (params.estado) queryParams.estado = params.estado;
      if (params.fechaInicio) queryParams.fechaInicio = params.fechaInicio.toISOString();
      if (params.fechaFin) queryParams.fechaFin = params.fechaFin.toISOString();
    }
    
    return this.http.get<any[]>(
      `${this.apiUrl}/${id}/pedidos`,
      { params: queryParams }
    );
  }

  /**
   * Actualiza la ubicación actual del repartidor
   */
  updateUbicacion(id: string, ubicacion: { latitud: number; longitud: number }): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${id}/ubicacion`,
      ubicacion
    );
  }

  /**
   * Obtiene el historial de ubicaciones de un repartidor
   */
  getHistorialUbicaciones(id: string, params?: {
    fechaInicio: Date;
    fechaFin: Date;
  }): Observable<Array<{
    latitud: number;
    longitud: number;
    fecha: Date;
    estadoSatelital: string;
  }>> {
    let queryParams: any = {};
    if (params) {
      if (params.fechaInicio) queryParams.fechaInicio = params.fechaInicio.toISOString();
      if (params.fechaFin) queryParams.fechaFin = params.fechaFin.toISOString();
    }
    
    return this.http.get<Array<{
      latitud: number;
      longitud: number;
      fecha: Date;
      estadoSatelital: string;
    }>>(
      `${this.apiUrl}/${id}/historial-ubicaciones`,
      { params: queryParams }
    );
  }
}

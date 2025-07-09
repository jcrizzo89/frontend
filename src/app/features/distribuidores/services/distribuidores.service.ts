import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Distribuidor } from '../models/distribuidor.model';
import { Order } from '../../admin/dashboard/models/order.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DistribuidoresService {
  private apiUrl = `${environment.apiUrl}/repartidores`;

  constructor(private http: HttpClient) {}

  getAllDistribuidores(): Observable<Distribuidor[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => data.map(d => this.mapDistribuidor(d)))
    );
  }

  getDistribuidor(id: string): Observable<Distribuidor> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(data => this.mapDistribuidor(data))
    );
  }

  createDistribuidor(distribuidor: Partial<Distribuidor>): Observable<Distribuidor> {
    const payload = {
      nombre: distribuidor.nombre,
      telefono: distribuidor.telefono,
      activo: distribuidor.activo,
      idZona: distribuidor.zonaId,
      imei: distribuidor.imei
    };
    return this.http.post<any>(this.apiUrl, payload).pipe(
      map(data => this.mapDistribuidor(data))
    );
  }

  updateDistribuidor(distribuidor: Distribuidor): Observable<Distribuidor> {
    const payload = {
      nombre: distribuidor.nombre,
      telefono: distribuidor.telefono,
      activo: distribuidor.activo,
      idZona: distribuidor.zonaId,
      imei: distribuidor.imei
    };
    return this.http.put<any>(`${this.apiUrl}/${distribuidor.id}`, payload).pipe(
      map(data => this.mapDistribuidor(data))
    );
  }

  deleteDistribuidor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPedidos(distribuidorId: string): Observable<Order[]> {
    return this.http.get<any>(`${this.apiUrl}/${distribuidorId}`).pipe(
      map(data => data.pedidos?.map((p: any) => this.mapOrder(p)) || [])
    );
  }

  updatePedido(pedido: Order): Observable<Order> {
    return this.http.put<any>(`http://localhost:3001/pedidos/${pedido.id}`, pedido).pipe(
      map(data => this.mapOrder(data))
    );
  }

  exportPedido(pedido: Order): Observable<boolean> {
    return this.http.post<boolean>(`http://localhost:3001/pedidos/${pedido.id}/exportar`, {});
  }

  private mapDistribuidor(d: any): Distribuidor {
    return {
      id: d.idRepartidor,
      nombre: d.nombre,
      telefono: d.telefono,
      imei: d.imei,
      activo: d.activo,
      zonaId: d.zona?.idZona,
      zonaNombre: d.zona?.nombre,
      pedidos: d.pedidos?.map((p: any) => this.mapOrder(p)) || []
    };
  }

  private mapOrder(p: any): Order {
    return {
      id: p.idPedido,
      nroPedido: p.nroPedido,
      estado: p.estado,

      clientName: p.cliente?.nombre || '',
      address: p.direccion,
      phone: p.cliente?.telefono || '',

      canal: p.canal,
      entrada: p.entrada,
      enviar: p.enviar,
      salida: p.salida,

      despachado: p.despachado,
      observaciones: p.observaciones,

      zona: p.zona?.nombre,
      importe: p.importe,

      repartidor: p.repartidor?.idRepartidor,
      pagaCon: p.pagaCon,

      linea: p.linea,
      talonario: p.talonario,
      descuento: p.descuento,

      productos: p.productos || [],
      historialEstados: p.historialEstados || [],

      latitudEntrega: p.latitudEntrega,
      longitudEntrega: p.longitudEntrega
    };
  }
}

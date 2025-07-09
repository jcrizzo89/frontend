// src/app/dashboard/models/zona.model.ts

import { Repartidor } from '../../repartidores/models/repartidor.model';

export interface Zona {
  idZona: string;
  zona: string;
  descripcion: string;
  barrios: string[];
  activa: boolean;
  fechaCreacion: Date;
  ultimaActualizacion?: Date;
  
  // Relaciones
  repartidores?: Repartidor[];
  clientes?: Array<{
    idCliente: string;
    nombre: string;
    telefono: string;
  }>;
  
  // Estadísticas
  totalClientes?: number;
  totalRepartidores?: number;
  totalPedidosHoy?: number;
}

export interface ZonaFormData extends Omit<Zona, 
  'idZona' | 'fechaCreacion' | 'ultimaActualizacion' | 'repartidores' | 'clientes' | 'totalClientes' | 'totalRepartidores' | 'totalPedidosHoy'
> {
  idRepartidores?: string[]; // IDs de repartidores a asignar
}

export interface ZonaStats {
  totalZonas: number;
  zonasActivas: number;
  totalClientes: number;
  totalRepartidores: number;
  pedidosPorZona: Array<{
    idZona: string;
    zona: string;
    totalPedidos: number;
    entregados: number;
    pendientes: number;
  }>;
}

export interface ZonaFilter {
  activa?: boolean;
  search?: string;
  conRepartidoresDisponibles?: boolean;
}

import { Zona } from '../../zonas/models/zona.model';

export interface Repartidor {
  idRepartidor: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email?: string;
  dni: string;
  fechaNacimiento?: Date;
  direccion?: string;
  imei?: string;
  estado: 'Activo' | 'Inactivo' | 'De vacaciones' | 'Suspendido';
  estadoSatelital: 'En línea' | 'Desconectado' | 'En entrega' | 'Inactivo';
  ultimaConexion?: Date;
  idZona?: string;
  zona?: Zona;
  fechaIngreso?: Date;
  observaciones?: string;
  // Relaciones
  pedidosAsignados?: number; // Número de pedidos asignados
  calificacionPromedio?: number; // Calificación promedio del repartidor
}

export interface RepartidorFormData extends Omit<Repartidor, 
  'idRepartidor' | 'estadoSatelital' | 'ultimaConexion' | 'zona' | 'pedidosAsignados' | 'calificacionPromedio'
> {
  idZona?: string;
  password?: string; // Solo para creación/actualización
}

export interface RepartidorStats {
  totalEntregas: number;
  entregasPendientes: number;
  calificacionPromedio: number;
  totalRecaudado: number;
  ultimosPedidos: Array<{
    idPedido: string;
    nroPedido: number;
    fecha: Date;
    monto: number;
    estado: string;
  }>;
}

// Estados posibles para los filtros
export type RepartidorEstado = 'Activo' | 'Inactivo' | 'De vacaciones' | 'Suspendido' | 'Todos';
export type RepartidorEstadoSatelital = 'En línea' | 'Desconectado' | 'En entrega' | 'Inactivo' | 'Todos';

import { Cliente } from '../../clients/models/client.model';

// Importaciones temporales hasta que se creen los modelos
interface Repartidor {
  idRepartidor: string;
  nombre: string;
}

interface Zona {
  idZona: string;
  nombre: string;
}

export enum EstadoPedido {
  PENDIENTE = 'Pendiente',
  ASIGNADO = 'Asignado',
  EN_CAMINO = 'En Camino',
  ENTREGADO = 'Entregado',
  CANCELADO = 'Cancelado',
  PENDIENTE_REPARTIDOR = 'Pendiente Repartidor'
}

export interface ProductoPedido {
  idProducto: string;
  producto?: {
    nombre: string;
    precio: number;
  };
  cantidad: number;
  precioUnitario: number;
  descuento?: number;
}

export interface EstadoPedidoHistorial {
  estado: EstadoPedido;
  fecha: Date;
  idUsuario?: string;
  usuario?: {
    nombre: string;
    email: string;
  };
  observaciones?: string;
}

export interface Pedido {
  idPedido: string;
  nroPedido: number;
  estado: EstadoPedido;
  
  // Relaciones
  idCliente: string;
  cliente?: Cliente;
  
  idZona?: string;
  zona?: Zona;
  
  idRepartidor?: string;
  repartidor?: Repartidor;
  
  // Datos del pedido
  entrada: Date;
  enviar?: Date;
  salida?: Date;
  despachado: boolean;
  observaciones?: string;
  importe: number;
  canal: string;
  
  // Productos del pedido
  productos: ProductoPedido[];
  
  // Historial de estados
  historialEstados?: EstadoPedidoHistorial[];
  
  // Ubicación de entrega
  idUbicacionEntrega?: string;
  ubicacionEntrega?: {
    latitud: number;
    longitud: number;
    descripcion?: string;
  };
}

export interface PedidoFormData {
  idCliente: string;
  idZona?: string;
  idRepartidor?: string;
  idUbicacionEntrega?: string;
  estado: EstadoPedido;
  observaciones?: string;
  productos: Array<{
    idProducto: string;
    cantidad: number;
    precioUnitario: number;
    descuento?: number;
  }>;
}

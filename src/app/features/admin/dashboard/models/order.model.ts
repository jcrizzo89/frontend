export type EstadoPedido = 'Pendiente' | 'Asignado' | 'En Camino' | 'Entregado' | 'Cancelado';

export interface Order {
  id: string; // idPedido
  nroPedido: number;
  estado: EstadoPedido;

  clientName: string;
  address?: string;
  phone?: string;

  canal: string;
  entrada: string;
  enviar?: string;
  salida?: string;

  despachado: boolean;
  observaciones?: string;
  notaPedido?: string;

  zona?: string;
  importe: number;

  repartidor?: string;
  pagaCon?: number;

  linea?: string;
  talonario?: string;

  descuento?: number;
  tipoBotellon?: string;
  cantidad?: number;
  noNotificar?: boolean;

  productos: {
    nombre: string;
    cantidad: number;
    precio: number;
  }[];

  historialEstados?: { estado: EstadoPedido; fecha: string }[];

  latitudEntrega?: number;
  longitudEntrega?: number;

  // UI state
  highlighted?: boolean;
}


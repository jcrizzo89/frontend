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

  zona?: string; // o Zona si se desea objeto completo
  importe: number;

  repartidor?: string; // ← idRepartidor o incluso objeto Distribuidor si se desea anidar
  pagaCon?: number;

  linea?: string;
  talonario?: string;

  descuento?: number;

  productos: {
    nombre: string;
    cantidad: number;
    precio: number;
  }[];

  historialEstados?: { estado: EstadoPedido; fecha: string }[];

  latitudEntrega?: number;
  longitudEntrega?: number;

    // ✅ Añadido:
  highlighted?: boolean;
}


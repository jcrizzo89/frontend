import { EstadoPedido } from "../../features/admin/dashboard/models/order.model";


export interface Order {
  idPedido: string;
  nroPedido: number;
  estado: EstadoPedido;
  entrada: string; // usar string porque vendrá como ISO string desde el backend
  enviar?: string;
  salida?: string;
  despachado: boolean;
  observaciones?: string;
  importe: number;
  pagaCon?: number;
  linea?: string;
  talonario?: string;
  canal: string;
  nombre?: string;
  historialEstados?: { estado: EstadoPedido; fecha: string }[];
  latitudEntrega?: number;
  longitudEntrega?: number;

  // campos derivados del backend (cliente, zona, repartidor) como strings para simplificación
  clienteNombre?: string;
  zonaNombre?: string;
  repartidorNombre?: string;
}

import { EstadoPedido } from "../../features/admin/dashboard/models/order.model";


export interface Order {
  idPedido: string;
  nroPedido: number;
  estado: EstadoPedido;
  entrada: string; // ISO string
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
  telefono?: string;
  direccion?: string;
  detalles?: string;
  
  // Alias para compatibilidad con el componente
  id?: string | number;
  clientName?: string;
  destination?: string;
  orderDetails?: string;
  phone?: string;
  status?: string;
  
  // campos derivados del backend (cliente, zona, repartidor) como strings para simplificación
  clienteNombre?: string;
  zonaNombre?: string;
  repartidorNombre?: string;
  
  // Métodos de ayuda
  getStatus?(): string;
  getClientName?(): string;
  getPhone?(): string;
  getDestination?(): string;
  getOrderDetails?(): string;
}

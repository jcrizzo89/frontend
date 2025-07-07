import { Order } from "../../admin/dashboard/models/order.model";


export interface Distribuidor {
  id: number;
  nombre: string;
  telefono: string;
  imei?: string;
  activo: boolean;
  zonaId: number;
  zonaNombre?: string;
  pedidos?: Order[]; // Usamos la interfaz ya completa de pedidos
}

export interface Client {
  id: string;
  nombre: string;
  telefono: string;
  observaciones?: string;
  alerta: boolean;
  cantLlamadas: number;
  fIngreso?: Date;
  domicilio?: string;
  zona: string; // Se puede ajustar a un objeto si se desea más información.
  pedidos: number;
  llamadas: number;
  latitudEntrega?: number;
  longitudEntrega?: number;
}

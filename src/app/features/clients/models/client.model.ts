// Importación temporal hasta que se cree el modelo de Pedido
interface Pedido {
  idPedido: string;
  nroPedido: number;
  estado: string;
  entrada: Date;
  importe: number;
}

export interface Cliente {
  idCliente: string;
  nombre: string;
  telefono: string;
  observaciones?: string;
  alerta: boolean;
  cantLlamadas: number;
  fIngreso?: Date;
  idZona: string;
  zona?: {
    idZona: string;
    zona: string;
  };
  ubicaciones?: UbicacionCliente[];
  pedidos?: Pedido[];
  llamadas?: Llamada[];
}

export interface UbicacionCliente {
  idUbicacion: string;
  descripcion?: string;
  latitud: number;
  longitud: number;
  linkMaps?: string;
  activa: boolean;
  idCliente: string;
}

export interface Llamada {
  idLlamada: string;
  fecha: Date;
  linea: string;
  idCliente: string;
}

export interface ClienteFormData extends Omit<Cliente, 'idCliente' | 'zona' | 'ubicaciones' | 'pedidos' | 'llamadas'> {
  idZona: string;
}

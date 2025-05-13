export interface Distribuidor {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  estado: 'activo' | 'inactivo';
  fechaRegistro: Date;
  ultimaActualizacion?: Date;
  vehiculo: string;
  fechaInicio: string;
  ultimoPedido: string;
  estadisticas: {
    pedidosEntregados: number;
    noEntregados: number;
    entregadosATiempo: number;
    entregadosConDemora: number;
    promedioTiempoEntrega: number;
  };
}

export interface DistribuidorPedido {
  id: string;
  fechaHora: Date;
  cliente: string;
  destino: string;
  estado: 'pendiente' | 'en_camino' | 'entregado' | 'cancelado';
  tiempoEstimado: number;
  observaciones?: string;
  canal: 'telefono' | 'whatsapp' | 'web';
}

import { Distribuidor, DistribuidorPedido } from '../models/distribuidor.model';

export const MOCK_DISTRIBUIDORES: Distribuidor[] = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    telefono: '11-1234-5678',
    email: 'juan.perez@email.com',
    direccion: 'Av. Rivadavia 1234',
    estado: 'activo',
    fechaRegistro: new Date('2024-01-15'),
    ultimaActualizacion: new Date('2024-04-20'),
    vehiculo: 'Fiat Fiorino',
    fechaInicio: '2024-01-15',
    ultimoPedido: '2024-04-23',
    estadisticas: {
      pedidosEntregados: 145,
      noEntregados: 3,
      entregadosATiempo: 140,
      entregadosConDemora: 5,
      promedioTiempoEntrega: 25
    }
  },
  {
    id: '2',
    nombre: 'María González',
    telefono: '11-2345-6789',
    email: 'maria.gonzalez@email.com',
    direccion: 'Calle Corrientes 567',
    estado: 'activo',
    fechaRegistro: new Date('2024-02-01'),
    ultimaActualizacion: new Date('2024-04-22'),
    vehiculo: 'Renault Kangoo',
    fechaInicio: '2024-02-01',
    ultimoPedido: '2024-04-24',
    estadisticas: {
      pedidosEntregados: 98,
      noEntregados: 1,
      entregadosATiempo: 95,
      entregadosConDemora: 3,
      promedioTiempoEntrega: 22
    }
  }
];

export const MOCK_PEDIDOS: { [key: string]: DistribuidorPedido[] } = {
  '1': [
    {
      id: 'p1',
      fechaHora: new Date('2024-04-23T10:30:00'),
      cliente: 'Carlos López',
      destino: 'San Martín 456',
      estado: 'entregado',
      tiempoEstimado: 30,
      canal: 'whatsapp',
      observaciones: 'Entregar en portería'
    },
    {
      id: 'p2',
      fechaHora: new Date('2024-04-23T14:15:00'),
      cliente: 'Ana Martínez',
      destino: 'Belgrano 789',
      estado: 'en_camino',
      tiempoEstimado: 25,
      canal: 'telefono',
      observaciones: 'Llamar al llegar'
    },
    {
      id: 'p3',
      fechaHora: new Date('2024-04-24T09:00:00'),
      cliente: 'Luis Rodríguez',
      destino: 'Sarmiento 123',
      estado: 'pendiente',
      tiempoEstimado: 35,
      canal: 'web',
      observaciones: undefined
    }
  ],
  '2': [
    {
      id: 'p4',
      fechaHora: new Date('2024-04-24T11:00:00'),
      cliente: 'Patricia Sánchez',
      destino: 'Florida 234',
      estado: 'entregado',
      tiempoEstimado: 20,
      canal: 'whatsapp',
      observaciones: 'Dejar en recepción'
    },
    {
      id: 'p5',
      fechaHora: new Date('2024-04-24T15:30:00'),
      cliente: 'Roberto García',
      destino: 'Lavalle 567',
      estado: 'pendiente',
      tiempoEstimado: 40,
      canal: 'web',
      observaciones: 'Timbre 2B'
    }
  ]
};

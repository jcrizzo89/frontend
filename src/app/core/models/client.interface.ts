export interface Client {
    id: number;
    number: string; // Número de identificación del cliente
    phone: string;
    name: string;
    address: string;
    observations: string;
    orderCount: number;
    type: 'regular' | 'good';
    lastOrderDate: string;
    lastOrderTime: string;
  }
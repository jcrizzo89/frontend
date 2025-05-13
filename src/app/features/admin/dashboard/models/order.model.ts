export interface Order {
  id: string;
  phone: string;
  clientName: string;
  address: string;
  notes?: string;
  orderNotes?: string;
  products: string;
  zone: string;
  vehicle?: string;
  time: string;
  date: string;
  channel: 'whatsapp' | 'phone';
  status: 'pendiente' | 'entregado';
  highlighted?: boolean;
  orderCount?: string;
  image?: string;
}

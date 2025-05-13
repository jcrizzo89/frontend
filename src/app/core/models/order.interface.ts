export interface Order {
    id: number;
    phone: string;
    clientName: string;
    destination: string;
    observations: string;
    orderDetails: string;
    notes: string;
    zone: string;
    vehicle: string;
    driver: string;
    time: string;
    duration: string;
    date: string;
    channel: 'whatsapp' | 'phone' | 'message';
    status: 'pending' | 'delivered' | 'cancelled';
  }
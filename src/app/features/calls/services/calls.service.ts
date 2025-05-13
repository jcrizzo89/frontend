import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Call } from '../components/calls-table/calls-table.component';

@Injectable({
  providedIn: 'root'
})
export class CallsService {
  private apiUrl = `${environment.apiUrl}/calls`;

  constructor(private http: HttpClient) {}

  private mockCalls: Call[] = [
    {
      id: '1',
      datetime: new Date(),
      phoneAndClient: {
        phone: '0985125271',
        client: 'MIRA MADERA'
      },
      destination: {
        address: 'SAN ANDRES Y AYAHUALPA - PRIMAVERA',
        observations: 'Portón madera esquina'
      },
      order: {
        details: '3 botellas de agua',
        notes: 'Sábado por la tarde'
      },
      zone: {
        name: '14',
        vehicle: 'Esteban'
      },
      channel: 'whatsapp',
      status: 'pending',
      callbackTime: 'Horario pref de 16 a 17'
    },
    {
      id: '2',
      datetime: new Date(Date.now() - 3600000),
      phoneAndClient: {
        phone: '0985 123048',
        client: 'FERRETERIA EL MARTILLO'
      },
      destination: {
        address: 'AV. 10 DE AGOSTO Y COLON',
        observations: 'Local esquinero, letrero azul'
      },
      order: {
        details: '5 botellones',
        notes: 'Entregar en la mañana'
      },
      zone: {
        name: '12',
        vehicle: 'Juan'
      },
      channel: 'phone',
      status: 'missed'
    },
    {
      id: '3',
      datetime: new Date(Date.now() - 7200000),
      phoneAndClient: {
        phone: '0998 456789',
        client: 'PANADERIA LA ESPIGA'
      },
      destination: {
        address: 'CALLE VENEZUELA Y CHILE',
        observations: 'Junto al Banco Pichincha'
      },
      order: {
        details: '2 botellones',
        notes: 'Cliente frecuente'
      },
      zone: {
        name: '8',
        vehicle: 'Pedro'
      },
      channel: 'whatsapp',
      status: 'completed'
    },
    {
      id: '4',
      datetime: new Date(Date.now() - 10800000),
      phoneAndClient: {
        phone: '0987 654321',
        client: 'RESTAURANTE EL SABOR'
      },
      destination: {
        address: 'AV. 6 DE DICIEMBRE Y PATRIA',
        observations: 'Edificio Torre Gris, piso 2'
      },
      order: {
        details: '4 botellones + 2 dispensadores',
        notes: 'Nuevo cliente'
      },
      zone: {
        name: '15',
        vehicle: 'Carlos'
      },
      channel: 'phone',
      status: 'pending'
    },
    {
      id: '5',
      datetime: new Date(Date.now() - 14400000),
      phoneAndClient: {
        phone: '0999 888777',
        client: 'OFICINA TECH SOLUTIONS'
      },
      destination: {
        address: 'AV. REPUBLICA Y ELOY ALFARO',
        observations: 'Edificio Metropolitan, piso 8'
      },
      order: {
        details: '6 botellones',
        notes: 'Pedido mensual'
      },
      zone: {
        name: '10',
        vehicle: 'Luis'
      },
      channel: 'whatsapp',
      status: 'completed'
    }
  ];

  getCalls(): Observable<Call[]> {
    // Simular un delay de red
    return of(this.mockCalls).pipe(
      delay(800)
    );
  }

  updateCallStatus(callId: string, status: 'pending' | 'missed' | 'completed'): Observable<any> {
    // Mock: actualizar el estado localmente
    const call = this.mockCalls.find(c => c.id === callId);
    if (call) {
      call.status = status;
    }
    return of({ success: true }).pipe(delay(500));
  }

  scheduleCallback(callId: string, callbackTime: string): Observable<any> {
    // Mock: actualizar el callback time localmente
    const call = this.mockCalls.find(c => c.id === callId);
    if (call) {
      call.callbackTime = callbackTime;
      call.status = 'pending';
    }
    return of({ success: true }).pipe(delay(500));
  }

  getCallDetails(callId: string): Observable<Call> {
    // Mock: retornar los detalles de la llamada
    const call = this.mockCalls.find(c => c.id === callId);
    if (!call) {
      return throwError(() => new Error('Call not found'));
    }
    return of(call).pipe(delay(500));
  }
}

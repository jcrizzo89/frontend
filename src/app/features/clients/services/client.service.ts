import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) { }

  getClients(): Observable<any[]> {
    // Por ahora retornamos datos de prueba
    return of([
      {
        id: 1,
        photo: 'assets/images/client1.jpg',
        phone: '0985 123456',
        name: 'MIRA MADERA',
        registrationDate: new Date('2024-02-08'),
        address: 'SAN ANDRES Y ATAHUALPA - PRIMAVERA',
        mapLink: 'https://www.google.com/maps?q=-0.123,78.456',
        observations: 'Portón madera esquina casa estilo colonial y portón negro',
        zone: '14',
        bottleType: 'Grande',
        type: 'Bueno'
      },
      {
        id: 2,
        photo: 'assets/images/client2.jpg',
        phone: '0985 789012',
        name: 'ESCUELA FE Y ALEGRIA',
        registrationDate: new Date('2024-02-07'),
        address: 'OLMEDO Y CUBA',
        mapLink: 'https://www.google.com/maps?q=-0.124,78.457',
        observations: 'Portón azul junto a cancha de escuela',
        zone: '14',
        bottleType: 'Grande',
        type: 'Regular'
      }
    ]);
  }

  getClient(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createClient(client: any): Observable<any> {
    return this.http.post(this.apiUrl, client);
  }

  updateClient(id: number, client: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, client);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

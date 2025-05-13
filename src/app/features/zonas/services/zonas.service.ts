import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Zona } from '../models/zona.model';

@Injectable({
  providedIn: 'root'
})
export class ZonasService {
  private zonas: Zona[] = [
    { 
      id: 1, 
      vehiculo: 1, 
      conductor: 'Luis Suarez', 
      descripcion: 'Desde calle x\nHasta calle x\nBarra J', 
      coordenadas: 'mymaps.com/agualuz/zona1'
    },
    { 
      id: 2, 
      vehiculo: 2, 
      conductor: 'Oscar Martinez', 
      descripcion: 'Desde calle x\nHasta calle x', 
      coordenadas: 'mymaps.com/agualuz/zona2'
    },
    { 
      id: 3, 
      vehiculo: 3, 
      conductor: 'Nestor Patricio', 
      descripcion: 'Desde calle x\nHasta calle x', 
      coordenadas: 'mymaps.com/agualuz/zona3'
    },
    { 
      id: 4, 
      vehiculo: 4, 
      conductor: 'Roberto Lamas', 
      descripcion: 'Desde calle x\nHasta calle x', 
      coordenadas: 'mymaps.com/agualuz/zona4'
    },
    { 
      id: 5, 
      vehiculo: 5, 
      conductor: 'Marcos Lopez', 
      descripcion: 'Desde calle x\nHasta calle x', 
      coordenadas: 'mymaps.com/agualuz/zona5'
    },
    { 
      id: 6, 
      vehiculo: 6, 
      conductor: 'Gerardo Gimenez', 
      descripcion: 'Desde calle x\nHasta calle x', 
      coordenadas: 'mymaps.com/agualuz/zona6'
    },
    { 
      id: 7, 
      vehiculo: 7, 
      conductor: 'Pedro Gomez', 
      descripcion: 'Desde calle x\nHasta calle x', 
      coordenadas: 'mymaps.com/agualuz/zona7'
    },
    { 
      id: 8, 
      vehiculo: 8, 
      conductor: 'Juan Pablo Perez', 
      descripcion: 'Desde calle x\nHasta calle x', 
      coordenadas: 'mymaps.com/agualuz/zona8'
    },
    { 
      id: 9, 
      vehiculo: 9, 
      conductor: 'Matias Luis', 
      descripcion: 'Desde calle x\nHasta calle x', 
      coordenadas: 'mymaps.com/agualuz/zona9'
    },
    { 
      id: 10, 
      vehiculo: 10, 
      conductor: 'Eduard Morales', 
      descripcion: 'Desde calle x\nHasta calle x', 
      coordenadas: 'mymaps.com/agualuz/zona10'
    },
    { 
      id: 11, 
      vehiculo: 11, 
      conductor: 'Mateo Pereira', 
      descripcion: 'Desde calle x\nHasta calle x', 
      coordenadas: 'mymaps.com/agualuz/zona11'
    }
  ];

  constructor() { }

  getZonas(): Observable<Zona[]> {
    return of(this.zonas);
  }

  getZonaById(id: number): Observable<Zona | undefined> {
    const zona = this.zonas.find(z => z.id === id);
    return of(zona);
  }

  updateZona(zona: Zona): Observable<Zona> {
    const index = this.zonas.findIndex(z => z.id === zona.id);
    if (index !== -1) {
      this.zonas[index] = { ...zona };
    }
    return of(zona);
  }

  addZona(zona: Zona): Observable<Zona> {
    const newId = Math.max(...this.zonas.map(z => z.id)) + 1;
    const newZona = { ...zona, id: newId };
    this.zonas.push(newZona);
    return of(newZona);
  }
}

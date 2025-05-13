import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Distribuidor } from '../../models/distribuidor.model';
import { DistribuidoresService } from '../../services/distribuidores.service';

@Component({
  selector: 'app-distribuidores-list',
  templateUrl: './distribuidores-list.component.html',
  styleUrls: ['./distribuidores-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class DistribuidoresListComponent implements OnInit {
  distribuidores: Distribuidor[] = [];
  loading = true;
  error: string | null = null;

  constructor(private distribuidoresService: DistribuidoresService) {}

  ngOnInit() {
    // Obtener los IDs de los distribuidores del mock
    const mockIds = ['1', '2'];
    this.loading = true;
    
    // Cargar cada distribuidor
    Promise.all(mockIds.map(id => 
      this.distribuidoresService.getDistribuidor(id).toPromise()
    ))
    .then(distribuidores => {
      this.distribuidores = distribuidores.filter(d => d !== null) as Distribuidor[];
      this.loading = false;
    })
    .catch(error => {
      console.error('Error loading distribuidores:', error);
      this.error = 'Error al cargar la lista de distribuidores';
      this.loading = false;
    });
  }
}

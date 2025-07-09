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
  this.loading = true;

  this.distribuidoresService.getAllDistribuidores().subscribe({
    next: (distribuidores) => {
      this.distribuidores = distribuidores;
      this.loading = false;
    },
    error: (error) => {
      console.error('Error loading distribuidores:', error);
      this.error = 'Error al cargar la lista de distribuidores';
      this.loading = false;
    }
  });
}


  getEntregadosATiempo(distribuidor: Distribuidor): number {
    if (!distribuidor.pedidos) return 0;

    return distribuidor.pedidos.filter(pedido => {
      if (pedido.estado !== 'Entregado' || !pedido.salida || !pedido.enviar) return false;

      const salida = new Date(pedido.salida);
      const enviar = new Date(pedido.enviar);
      return salida <= enviar;
    }).length;
  }


  getTotalPedidos(distribuidor: Distribuidor): number {
    return distribuidor.pedidos?.length || 0;
  }
}

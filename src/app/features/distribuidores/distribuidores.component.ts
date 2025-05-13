import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { Distribuidor, DistribuidorPedido } from './models/distribuidor.model';
import { DistribuidoresService } from './services/distribuidores.service';
import { DistribuidorDetailComponent } from './components/distribuidor-detail/distribuidor-detail.component';
import { PedidosHistorialComponent } from './components/pedidos-historial/pedidos-historial.component';

@Component({
  selector: 'app-distribuidores',
  templateUrl: './distribuidores.component.html',
  styleUrls: ['./distribuidores.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DistribuidorDetailComponent,
    PedidosHistorialComponent
  ],
  providers: [DistribuidoresService]
})
export class DistribuidoresComponent implements OnInit {
  distribuidor: Distribuidor | null = null;
  pedidosHistorial: DistribuidorPedido[] = [];
  loading = true;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private distribuidoresService: DistribuidoresService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (!id) {
        this.error = 'ID de distribuidor no encontrado';
        this.loading = false;
        return;
      }
      this.loadDistribuidor(id);
    });
  }

  private loadDistribuidor(id: string) {
    this.loading = true;
    this.error = null;
    this.successMessage = null;

    this.distribuidoresService.getDistribuidor(id).subscribe({
      next: (distribuidor) => {
        this.distribuidor = distribuidor;
        this.loadPedidosHistorial(id);
      },
      error: (error: any) => {
        console.error('Error loading distribuidor:', error);
        this.error = 'Error al cargar los datos del distribuidor';
        this.loading = false;
      }
    });
  }

  private loadPedidosHistorial(distribuidorId: string) {
    this.distribuidoresService.getPedidos(distribuidorId).subscribe({
      next: (pedidos) => {
        this.pedidosHistorial = pedidos;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading pedidos:', error);
        this.error = 'Error al cargar el historial de pedidos';
        this.loading = false;
      }
    });
  }

  onDistribuidorUpdated(distribuidor: Distribuidor) {
    this.loading = true;
    this.error = null;
    this.successMessage = null;

    this.distribuidoresService.updateDistribuidor(distribuidor).subscribe({
      next: (updatedDistribuidor) => {
        this.distribuidor = updatedDistribuidor;
        this.successMessage = 'Distribuidor actualizado correctamente';
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error updating distribuidor:', error);
        this.error = 'Error al actualizar el distribuidor';
        this.loading = false;
      }
    });
  }

  onPedidoUpdated(pedido: DistribuidorPedido) {
    this.loading = true;
    this.error = null;
    this.successMessage = null;

    this.distribuidoresService.updatePedido(pedido).subscribe({
      next: (updatedPedido) => {
        const index = this.pedidosHistorial.findIndex(p => p.id === pedido.id);
        if (index !== -1) {
          this.pedidosHistorial[index] = updatedPedido;
        }
        this.successMessage = 'Pedido actualizado correctamente';
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error updating pedido:', error);
        this.error = 'Error al actualizar el pedido';
        this.loading = false;
      }
    });
  }

  onExportPedido(pedido: DistribuidorPedido) {
    this.loading = true;
    this.error = null;
    this.successMessage = null;

    this.distribuidoresService.exportPedido(pedido).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = 'Pedido exportado correctamente';
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error exporting pedido:', error);
        this.error = 'Error al exportar el pedido';
        this.loading = false;
      }
    });
  }
}

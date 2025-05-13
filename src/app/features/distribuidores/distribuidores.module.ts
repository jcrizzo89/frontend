import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { DistribuidoresComponent } from './distribuidores.component';
import { DistribuidorDetailComponent } from './components/distribuidor-detail/distribuidor-detail.component';
import { PedidosHistorialComponent } from './components/pedidos-historial/pedidos-historial.component';
import { DistribuidoresService } from './services/distribuidores.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    DistribuidoresComponent,
    DistribuidorDetailComponent,
    PedidosHistorialComponent
  ],
  providers: [
    DistribuidoresService
  ]
})
export class DistribuidoresModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DistribuidoresComponent } from './distribuidores.component';

const routes: Routes = [
  {
    path: '',
    component: DistribuidoresComponent
  },
  {
    path: ':id',
    component: DistribuidoresComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistribuidoresRoutingModule { }

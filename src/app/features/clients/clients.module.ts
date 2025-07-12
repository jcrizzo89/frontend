import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../../shared/material/material.module';
import { SharedModule } from '../../shared/shared.module';

// Components
import { ClientsPageComponent } from './pages/clients-page/clients-page.component';
import { ClientListComponent } from './components/client-list/client-list.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { ClientFiltersComponent } from './components/client-filters/client-filters.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: ClientsPageComponent
  }
];

@NgModule({
  declarations: [
    ClientsPageComponent,
    ClientListComponent,
    ClientFormComponent,
    ClientFiltersComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MaterialModule,
    SharedModule
  ],
  exports: [
    ClientsPageComponent
  ]
})
export class ClientsModule { }

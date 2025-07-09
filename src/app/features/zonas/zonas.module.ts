import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Components
import { ZonasPageComponent } from './pages/zonas-page/zonas-page.component';
import { ZonaListComponent } from './components/zona-list/zona-list.component';
import { ZonaFormComponent } from './components/zona-form/zona-form.component';

// Services
import { ZonaService } from '../../core/services/zona.service';

const routes: Routes = [
  {
    path: '',
    component: ZonasPageComponent
  }
];

@NgModule({
  declarations: [
    ZonasPageComponent,
    ZonaListComponent,
    ZonaFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [
    ZonaService
  ],
  exports: [
    ZonasPageComponent
  ]
})
export class ZonasModule { }

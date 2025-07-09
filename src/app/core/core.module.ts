import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';

// Services
import { AuthService } from './services/auth.service';
import { LoadingService } from './services/loading.service';
import { NotificationService } from './services/notification.service';

// Components
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  declarations: [
    LoadingComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    MatProgressSpinnerModule
  ],
  exports: [
    LoadingComponent
  ],
  providers: [
    // Servicios
    AuthService,
    LoadingService,
    NotificationService,
    
    // Interceptores
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
  ]
})
export class CoreModule { 
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    // Asegurarse de que CoreModule solo se importe una vez en AppModule
    if (parentModule) {
      throw new Error('CoreModule ya está cargado. Debe importarse solo en AppModule.');
    }
  }
}
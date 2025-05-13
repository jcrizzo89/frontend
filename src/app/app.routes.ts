import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./core/layout/admin-layout/admin-layout.component')
      .then(m => m.AdminLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'clients',
        loadChildren: () => import('./features/clients/clients.module')
          .then(m => m.ClientsModule)
      },
      {
        path: 'zones',
        loadComponent: () => import('./features/zonas/zonas.component')
          .then(m => m.ZonasComponent)
      },
      {
        path: 'distributors',
        loadComponent: () => import('./features/distribuidores/components/distribuidores-list/distribuidores-list.component')
          .then(m => m.DistribuidoresListComponent)
      },
      {
        path: 'distributors/:id',
        loadComponent: () => import('./features/distribuidores/distribuidores.component')
          .then(m => m.DistribuidoresComponent)
      },
      {
        path: 'calls',
        children: [
          {
            path: '',
            redirectTo: 'history',
            pathMatch: 'full'
          },
          {
            path: 'history',
            loadComponent: () => import('./features/calls/pages/calls-history/calls-history.component')
              .then(m => m.CallsHistoryComponent)
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
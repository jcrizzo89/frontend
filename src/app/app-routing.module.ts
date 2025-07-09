import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/user.model';
import { LayoutComponent } from './core/layout/layout.component';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';

const routes: Routes = [
  // Ruta de autenticación (cargada mediante carga perezosa)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  
  // Ruta principal con layout
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // Ruta de inicio
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { 
        path: 'inicio', 
        loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
        data: { title: 'Inicio' }
      },
      
      // Módulo de clientes
      { 
        path: 'clientes', 
        loadChildren: () => import('./features/clientes/clientes.module').then(m => m.ClientesModule),
        data: { 
          title: 'Clientes',
          roles: [UserRole.ADMIN, UserRole.VENDEDOR, UserRole.REPARTIDOR]
        },
        canActivate: [RoleGuard]
      },
      
      // Módulo de pedidos
      { 
        path: 'pedidos', 
        loadChildren: () => import('./features/pedidos/pedidos.module').then(m => m.PedidosModule),
        data: { 
          title: 'Pedidos',
          roles: [UserRole.ADMIN, UserRole.VENDEDOR, UserRole.REPARTIDOR]
        },
        canActivate: [RoleGuard]
      },
      
      // Módulo de repartidores
      { 
        path: 'repartidores', 
        loadChildren: () => import('./features/repartidores/repartidores.module').then(m => m.RepartidoresModule),
        data: { 
          title: 'Repartidores',
          roles: [UserRole.ADMIN, UserRole.SUPERVISOR]
        },
        canActivate: [RoleGuard]
      },
      
      // Módulo de zonas
      { 
        path: 'zonas', 
        loadChildren: () => import('./features/zonas/zonas.module').then(m => m.ZonasModule),
        data: { 
          title: 'Zonas',
          roles: [UserRole.ADMIN, UserRole.SUPERVISOR]
        },
        canActivate: [RoleGuard]
      },
      
      // Módulo de productos
      { 
        path: 'productos', 
        loadChildren: () => import('./features/productos/productos.module').then(m => m.ProductosModule),
        data: { 
          title: 'Productos',
          roles: [UserRole.ADMIN, UserRole.INVENTARIO]
        },
        canActivate: [RoleGuard]
      },
      
      // Módulo de categorías
      { 
        path: 'categorias', 
        loadChildren: () => import('./features/categorias/categorias.module').then(m => m.CategoriasModule),
        data: { 
          title: 'Categorías',
          roles: [UserRole.ADMIN, UserRole.INVENTARIO]
        },
        canActivate: [RoleGuard]
      },
      
      // Módulo de configuración
      { 
        path: 'configuracion', 
        loadChildren: () => import('./features/configuracion/configuracion.module').then(m => m.ConfiguracionModule),
        data: { 
          title: 'Configuración',
          roles: [UserRole.ADMIN]
        },
        canActivate: [RoleGuard]
      },
      
      // Página no encontrada
      { path: '**', component: PageNotFoundComponent, data: { title: 'Página no encontrada' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

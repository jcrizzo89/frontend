import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Route, UrlSegment } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuth(route, state?.url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuth(childRoute, state?.url);
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url = `/${segments.join('/')}`;
    return this.checkAuth(undefined, url);
  }

  private checkAuth(route: ActivatedRouteSnapshot | undefined, url: string): Observable<boolean> {
    // Verificar si el usuario está autenticado
    return this.authService.checkAuth().pipe(
      map(isAuthenticated => {
        if (!isAuthenticated) {
          // Guardar la URL solicitada para redirección después del login
          this.authService.redirectUrl = url;
          
          // Redirigir a la página de login
          this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: url }
          });
          
          // Mostrar mensaje informativo
          this.notification.showInfo('Por favor, inicia sesión para acceder a esta página');
          return false;
        }
        
        // Verificar si la ruta requiere roles específicos
        const requiredRoles = route?.data?.['roles'] as UserRole[] | undefined;
        if (requiredRoles && requiredRoles.length > 0) {
          const currentUser = this.authService.getCurrentUser();
          const userRole = currentUser?.rol;
          
          if (!userRole || !requiredRoles.includes(userRole)) {
            this.notification.showError('No tienes permiso para acceder a esta sección');
            this.router.navigate(['/']);
            return false;
          }
        }
        
        return true;
      }),
      catchError(() => {
        this.router.navigate(['/auth/login'], {
          queryParams: { returnUrl: url }
        });
        return of(false);
      })
    );
  }
}
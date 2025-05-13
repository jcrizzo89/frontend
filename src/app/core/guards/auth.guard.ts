import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    console.log('AuthGuard.canActivate - Checking authentication');
    const user = this.authService.getCurrentUser();
    console.log('Current user:', user);
    
    if (!user) {
      console.log('No user found, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }

    console.log('User is authenticated, allowing access');
    return true;
  }
}
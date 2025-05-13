import { Injectable } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface LoginResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private token: string | null = null;
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {
    this.loadSession();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/signin`, credentials);
  }

  private loadSession(): void {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedToken && storedUser) {
      try {
        this.token = storedToken;
        this.currentUser = JSON.parse(storedUser);
      } catch (error) {
        console.error('Error al cargar la sesión:', error);
        this.logout();
      }
    }
  }

  public setSession(authResult: LoginResponse): void {
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('currentUser', JSON.stringify(authResult.user));
    this.token = authResult.token;
    this.currentUser = authResult.user;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.token = null;
    this.currentUser = null;
  }

  isLoggedIn(): boolean {
    return !!this.token && !!this.currentUser;
  }

  getToken(): string | null {
    if (!this.token) {
      this.loadSession();
    }
    return this.token;
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      this.loadSession();
    }
    return this.currentUser;
  }
}
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, Permission } from '../models/auth.model';
import { UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  // Signals para el estado reactivo
  public currentUser = signal<UserProfile | null>(null);
  public userPermissions = signal<Permission[]>([]);
  public isAuthenticated = signal<boolean>(false);

  constructor() {
    this.loadSession();
  }

  // 1. Hacer Login
  login(credentials: LoginRequest) {
    return this.http.post<{ data: LoginResponse }>(`${this.apiUrl}/sesion/login`, credentials).pipe(
      tap(response => {
        // Guardar tokens (¡Ojo! NestJS envuelve la respuesta en 'data')
        const tokens = response.data;
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);
        
        // Cargar perfil y permisos
        this.loadUserData();
      })
    );
  }

  // 2. Cargar perfil y permisos después del login
  private loadUserData() {
    this.http.get<{ data: { user: UserProfile } }>(`${this.apiUrl}/sesion/perfil`).subscribe(res => {
      this.currentUser.set(res.data.user);
      this.isAuthenticated.set(true);
      
      // Una vez tenemos el usuario, pedimos sus permisos
      this.http.get<{ data: { permissions: Permission[] } }>(`${this.apiUrl}/permisos`).subscribe(permRes => {
        this.userPermissions.set(permRes.data.permissions);
        console.log('Permisos cargados:', this.userPermissions());
      });
    });
  }

  // 3. Cargar sesión si el usuario recarga la página (F5)
  private loadSession() {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.isAuthenticated.set(true);
      this.loadUserData();
    }
  }

  // 4. Cerrar sesión
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUser.set(null);
    this.userPermissions.set([]);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  // Helper para obtener el token en las peticiones HTTP
  getToken() {
    return localStorage.getItem('access_token');
  }
}
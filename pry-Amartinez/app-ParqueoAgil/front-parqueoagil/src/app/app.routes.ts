import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';

// Guard: Protege las rutas privadas
const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated()) return true;
  router.navigate(['/login']);
  return false;
};

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then(m => m.Shell),
    canActivate: [authGuard], // Solo entran los logueados
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home').then(m => m.Home) // Dashboard
      },
      {
        path: 'clientes',
        // Carga diferida del componente de la tabla de clientes
        loadComponent: () => import('./features/clients/clients-list/clients-list').then(m => m.ClientsList)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
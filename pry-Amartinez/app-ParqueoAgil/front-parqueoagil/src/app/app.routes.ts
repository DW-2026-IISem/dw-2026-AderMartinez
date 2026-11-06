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
        loadComponent: () => import('./features/clients/clients-list/clients-list').then(m => m.ClientsList)
      },
      {
        path: 'drivers',
        loadComponent: () => import('./features/drivers/drivers-list/drivers-list').then(m => m.DriversList)
      },
      // NUEVA RUTA: Tipos de Vehículo
      {
        path: 'vehicle-types',
        loadComponent: () => import('./features/vehicle-types/vehicle-type-list/vehicle-type-list').then(m => m.VehicleTypeList)
      },
      {
        path: 'parking-zones',
        loadComponent: () => import('./features/parking-zones/parking-zone-list/parking-zone-list').then(m => m.ParkingZoneList)
      },
      {
        path: 'tickets',
        loadComponent: () => import('./features/tickets/ticket-list/ticket-list').then(m => m.TicketList)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/authGuard/auth-guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate:[guestGuard],
    loadComponent: () => import('./features/auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.page').then( m => m.DashboardPage)
  },
];

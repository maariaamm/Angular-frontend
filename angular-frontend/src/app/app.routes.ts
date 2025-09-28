import { inject } from '@angular/core';
import { Routes, ResolveFn } from '@angular/router';
import { Index } from './pages/index';
import { AdDetail } from './pages/ad-detail/ad-detail';
import AuthData from './models/AuthData';
import { AuthService } from './services/auth-service';
import { AuthGuard } from './guards/auth-guard';

export const userResolver: ResolveFn<AuthData | undefined> = (route) => {
  const authService = inject(AuthService);
  if (!authService.authData()) {
    throw new Error('unauthorized');
  }
  return authService.authData()
};

export const routes: Routes = [
  {
    path: '',
    component: Index,
  },
  {
    path: 'ad-details/:id',
    component: AdDetail,
  },
  {
    path: 'login',
    component: Index,
    data: { login: true }
  },
  {
    path: 'signup',
    component: Index,
    data: { signup: true }
  },
  {
    path: 'create-ad',
    component: Index,
    canActivate: [AuthGuard]
  },
];

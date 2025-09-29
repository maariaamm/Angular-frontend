import { inject } from '@angular/core';
import { Routes, ResolveFn } from '@angular/router';
import { Index } from './pages/index';
import { AdDetail } from './pages/ad-detail/ad-detail';
import AuthData from './models/AuthData';
import { AuthService } from './services/auth-service';
import { AuthGuard } from './guards/auth-guard';
import { AddAd } from './pages/add-ad/add-ad';

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
    component: AddAd,
    canActivate: [AuthGuard],
  },
  {
    path: 'my-cars',
    component: Index,
    canActivate: [AuthGuard],
    data: { myCars: true }
  }
];

import { Routes } from '@angular/router';
import { Index } from './pages/index';
import { AdDetail } from './pages/ad-detail/ad-detail';

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
  }
];

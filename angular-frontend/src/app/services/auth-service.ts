import { Injectable, signal } from '@angular/core';
import { ApiService } from './api-service'
import AuthData from '../models/AuthData';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedInSignal = signal<boolean>(false);
  authData = signal<AuthData | undefined>(undefined);

  constructor(private apiService: ApiService) {
    const authData = localStorage.getItem("auth_data");
    this.isLoggedInSignal.set(!!authData);
    this.authData.set(authData ? JSON.parse(authData) : undefined);
  }

  async login(username: string, password: string) {
    const authData = this.apiService.login(username, password);

    this.authData.set(await authData.toPromise());
    this.isLoggedInSignal.set(true);
    localStorage.setItem("auth_data", JSON.stringify(this.authData()));
  }

  async logout() {
    this.authData.set(undefined);
    this.isLoggedInSignal.set(false);
    localStorage.removeItem("auth_data");
  }

  async signup(username: string, email: string, password: string) {
    const authData = this.apiService.signup(username, email, password);
    this.authData.set(await authData.toPromise());
    this.isLoggedInSignal.set(true);
    localStorage.setItem("auth_data", JSON.stringify(this.authData()));
  }

}

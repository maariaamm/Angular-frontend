import { Injectable, signal } from '@angular/core';
import { ApiService } from './api-service'
import LoginResponse from '../models/LoginResponse';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedInSignal = signal<boolean>(false);
  authData = signal<LoginResponse | undefined>(undefined);

  constructor(private apiService: ApiService) {
    const authData = localStorage.getItem("auth_data");
    this.isLoggedInSignal.set(!!authData);
    this.authData.set(authData ? JSON.parse(authData) : undefined);
  }

  async login(username: string, password: string) {
    const authData = this.apiService.login(username, password);

    this.authData.set(await toSignal(authData)());
    this.isLoggedInSignal.set(true);
    localStorage.setItem("auth_data", JSON.stringify(this.authData()));
  }

}

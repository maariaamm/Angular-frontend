import { Component, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css'
})
export class LoginForm {
  authService = inject(AuthService);

  username = '';
  password = '';

  constructor() {}

  async onSubmit(form?: NgForm) {
    if (form?.valid) {
      console.log('Form Submitted!');
      console.log('Username:', this.username);
      console.log('Password:', this.password);
      await this.authService.login(this.username, this.password);
    } else {
      console.log('Form is invalid');
    }
  }
}

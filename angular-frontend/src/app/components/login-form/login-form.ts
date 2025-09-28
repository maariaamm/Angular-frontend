import { Component, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ModalService } from '../../services/modal-service';

@Component({
  selector: 'app-login-form',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css'
})
export class LoginForm {
  authService = inject(AuthService);
  private router = inject(Router);
  modalService = inject(ModalService);

  username = '';
  password = '';

  async onSubmit(form?: NgForm) {
    if (form?.valid) {
      await this.authService.login(this.username, this.password);
      this.modalService.closeModal();
      this.router.navigate(['/']);
    } else {
      console.log('Form is invalid');
    }
  }
}

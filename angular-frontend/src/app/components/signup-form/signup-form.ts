import { Component, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router'
import { ModalService } from '../../services/modal-service';

@Component({
  selector: 'app-signup-form',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.css'
})
export class SignupForm {
authService = inject(AuthService);
  private router = inject(Router);
  modalService = inject(ModalService);

  username = '';
  password = '';
  email = '';

  errorMessage = '';

  async onSubmit(form?: NgForm) {
    if (form?.valid) {
      try {
        await this.authService.signup(this.username, this.email, this.password)
        this.modalService.closeModal();
        this.router.navigate(['/']);
      }catch(httpError:any){
        this.errorMessage = httpError.error.message;
        return;
      }
    } else {
      console.log('Form is invalid');
    }
  }
}

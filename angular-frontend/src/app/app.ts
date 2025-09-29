import { Component, signal, ViewEncapsulation, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { LoginForm } from './components/login-form/login-form';
import { Modal } from './components/modal/modal';
import { AuthService } from './services/auth-service';
import { CommonModule } from '@angular/common';
import { ModalService } from './services/modal-service';
import { SignupForm } from './components/signup-form/signup-form';
import { EditModal } from './components/edit-modal/edit-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Modal, LoginForm, SignupForm, CommonModule, EditModal],
  templateUrl: './app.html',
  styleUrl: './app.css',
  encapsulation: ViewEncapsulation.None,
})
export class App {
  protected readonly title = signal('angular-frontend');
  auth = inject(AuthService);
  modalService = inject(ModalService);
  isLoggedIn = this.auth.isLoggedInSignal;
  
  showLoginForm() {
    this.modalService.openLoginModal();
  }

  closeModal() {
    this.modalService.closeModal();
  }

}

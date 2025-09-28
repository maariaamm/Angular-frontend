import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { inject } from '@angular/core';
import { ModalService } from '../../services/modal-service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  auth = inject(AuthService);
  modalService = inject(ModalService);


  logout() {
    this.auth.logout();
  }
}

import { Component, model, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal-service';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class Modal {
  modalService = inject(ModalService);
  isOpen = this.modalService.modalVisible();
  title = '';

  close() {
    this.modalService.closeModal();
  }

  
}

import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modalVisible = signal(false);
  showModal = signal("");
  
  openLoginModal() {
    console.log("Opening login modal");
    this.showModal.set("login");
    this.modalVisible.set(true);
  }

  closeModal() {
    this.modalVisible.set(false);
    this.showModal.set("");
  }
}

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

  openSignupModal() {
    console.log("Opening signup modal");
    this.showModal.set("signup");
    this.modalVisible.set(true);
  }

  closeModal() {
    this.modalVisible.set(false);
    this.showModal.set("");
  }

  openErrorModal(message: string) {
    console.log("Opening error modal with message:", message);
    this.showModal.set(message);
    this.modalVisible.set(true);
  }
}

import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modalVisible = signal(false);
  showModal = signal("");
  data = signal<any>(null);
  
  openLoginModal() {
    this.showModal.set("login");
    this.modalVisible.set(true);
  }

  openSignupModal() {
    this.showModal.set("signup");
    this.modalVisible.set(true);
  }

  closeModal() {
    this.modalVisible.set(false);
    this.showModal.set("");
    this.data.set(null);
  }

  openErrorModal(message: string) {
    this.showModal.set(message);
    this.modalVisible.set(true);
  }

  openEditModal(adId: string, ad$?: any) {
    this.showModal.set("edit");
    this.modalVisible.set(true);
    this.data.set({ adId, ad$ });
  }
}

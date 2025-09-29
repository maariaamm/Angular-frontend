import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { ModalService } from '../../services/modal-service';
import CarAd from '../../models/CarAd';
import { ApiService } from '../../services/api-service';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-modal.html',
  styleUrl: './edit-modal.css'
})
export class EditModal {
  private router = inject(Router);
  authService = inject(AuthService);
  modalService = inject(ModalService);
  apiService = inject(ApiService);

  adId = '';
  brand = '';
  model = '';
  year = new Date().getFullYear();
  price = 0;
  description = '';
  imageUrl = '';
  fuelType = '';

  constructor() {
    const data = this.modalService.data();
    if (data) {
      const { adId, ad$ } = data;
      this.adId = adId;

      ad$.subscribe((ad:CarAd) => {
        if (ad) {
          this.brand = ad.brand;
          this.model = ad.model;
          this.year = ad.year;
          this.price = ad.price;
          this.description = ad.description;
          this.imageUrl = ad.imageUrl!;
          this.fuelType = ad.fuelType;
        }
      });
    }
  }


  async onSubmit(form?: NgForm) {
    if (form?.invalid) {
      return;
    }

    const token = this.authService.authData()?.token!;
    const updatedAd = {
      brand: this.brand,
      model: this.model,
      year: this.year,
      price: this.price,
      description: this.description,
      imageUrl: this.imageUrl,
      fuelType: this.fuelType
    };

    this.apiService.updateAd(this.adId, updatedAd, token).toPromise();
    window.location.reload();
  }

}

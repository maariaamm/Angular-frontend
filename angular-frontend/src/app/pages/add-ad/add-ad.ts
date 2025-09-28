import { Component, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { ModalService } from '../../services/modal-service';
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api-service';

@Component({
  selector: 'app-add-ad',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-ad.html',
  styleUrl: './add-ad.css'
})
export class AddAd {
  apiService = inject(ApiService);
  authService = inject(AuthService);
  private router = inject(Router);
  modalService = inject(ModalService);

  brand = '';
  model = '';
  year = new Date().getFullYear();
  price = 0;
  description = '';
  imageUrl = '';
  fuelType = '';

  async onSubmit(form?: NgForm) {
    if (form?.valid) {
      try {
        const token = this.authService.authData()?.token;
        if (!token) {
          this.modalService.openErrorModal('unauthorized');
          return;
        }

        await this.apiService.createAd({
          brand: this.brand,
          model: this.model,
          year: this.year,
          price: this.price,
          description: this.description,
          imageUrl: this.imageUrl,
          fuelType: this.fuelType
        }, token).toPromise();

        this.apiService.fetchCars();
        
        this.router.navigate(['/']);
      } catch (error) {
        this.modalService.openErrorModal('failing-creating-ad');
      }      
    } else {
      console.log('Form is invalid');
    }
  }
}

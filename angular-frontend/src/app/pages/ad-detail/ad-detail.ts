import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api-service';
import { Observable, firstValueFrom } from 'rxjs';
import CarAd from '../../models/CarAd';
import { AsyncPipe, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal-service';

@Component({
  selector: 'app-ad-detail',
  imports: [AsyncPipe, DatePipe, CommonModule],
  templateUrl: './ad-detail.html',
  styleUrl: './ad-detail.css'
})
export class AdDetail {
  private router = inject(Router);
  modalService = inject(ModalService);
  private apiService = inject(ApiService);
  authService = inject(AuthService);
  private activatedRoute = inject(ActivatedRoute);
  adId = '';
  ad$?: Observable<CarAd>;
  isAuthor$ = signal(false);

  constructor() {
    this.activatedRoute.params.subscribe(async (params) => {
      this.adId =  params['id'];
      this.ad$ = this.fetchAdDetails();
      const author = await firstValueFrom(this.ad$!);
      this.isAuthor$.set(this.authService.authData()?.user.id === author.user?._id);
    });
  }

  fetchAdDetails(): Observable<CarAd> | undefined {
    if (!this.adId) {
      return undefined;
    }
    return this.apiService.fetchById(this.adId);
  }

  async deleteAd() {
    const token = this.authService.authData()?.token;
    if (!token) {
      return;
    }

    await this.apiService.deleteAd(this.adId, token).toPromise();
    this.apiService.fetchCars();
    this.router.navigate(['/']);
  }

  openEditModal() {
    this.modalService.openEditModal(this.adId, this.ad$);
  }
}

import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api-service';
import { Observable, firstValueFrom } from 'rxjs';
import CarAd from '../../models/CarAd';
import { AsyncPipe, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ad-detail',
  imports: [AsyncPipe, DatePipe, CommonModule],
  templateUrl: './ad-detail.html',
  styleUrl: './ad-detail.css'
})
export class AdDetail {
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
}

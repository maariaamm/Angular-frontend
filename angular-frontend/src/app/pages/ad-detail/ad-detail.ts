import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api-service';
import { Observable } from 'rxjs';
import CarAd from '../../models/CarAd';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-ad-detail',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './ad-detail.html',
  styleUrl: './ad-detail.css'
})
export class AdDetail {
  private apiService = inject(ApiService)
  private activatedRoute = inject(ActivatedRoute);
  adId = '';
  ad$?: Observable<CarAd>;

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      this.adId =  params['id'];
      this.ad$ = this.fetchAdDetails();
    });
  }

  fetchAdDetails(): Observable<CarAd> | undefined {
    if (!this.adId) {
      return undefined;
    }
    return this.apiService.fetchById(this.adId);
  }
}

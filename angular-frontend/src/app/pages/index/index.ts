import { Component, inject, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { CommonModule, AsyncPipe } from '@angular/common'
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from '../../services/modal-service';
import { Observable } from 'rxjs';
import CarAd from '../../models/CarAd';

@Component({
  selector: 'app-index',
  imports: [AsyncPipe, CommonModule, RouterModule],
  templateUrl: './index.html',
  styleUrl: './index.css',
  encapsulation: ViewEncapsulation.None,
})
export class Index {
  private activatedRoute = inject(ActivatedRoute);
  private apiClient = inject(ApiService)
  private authService = inject(AuthService)
  private modalService = inject(ModalService)

  public carsAd?: Observable<CarAd[]>;
  public isLoggedIn = this.authService.isLoggedInSignal;

  title = "Car web site"

  constructor(private router: Router) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['errorMessage']) {
        this.modalService.openErrorModal(params['errorMessage']);
        this.router.navigate([], {
          queryParams: { errorMessage: null },
          queryParamsHandling: 'merge'
        });
      }
    });

    this.activatedRoute.data.subscribe(data => {
      if (data['login']) {
        this.modalService.openLoginModal();
      }
      if (data['signup']) {
        this.modalService.openSignupModal();
      }
    })
  }

  ngOnInit() {
    if (this.apiClient.hasData()) {
      this.carsAd = this.apiClient.getData();
    } else {
      this.carsAd = this.apiClient.fetchCars();
    }
  }

}



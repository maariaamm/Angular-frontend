import { Injectable, inject } from '@angular/core';
import { HttpClient as AngularHttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import CarAd from '../models/CarAd';

@Injectable({
  providedIn: 'root'
})
export class HttpClient {
  private http = inject(AngularHttpClient);

  fetchCars() : Observable<CarAd[]>{
    let something = this.http.get<CarAd[]>("https://u05-restful-api-4.onrender.com/api/carAds");
    return something;
  }

}

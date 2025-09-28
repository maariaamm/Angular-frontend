import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import CarAd from '../models/CarAd';
import AuthData from '../models/AuthData';
import CreateAdDTO from '../models/CreateAdDTO';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private cachedData?: Observable<CarAd[]>;

  setData(data: Observable<CarAd[]> ) {
    this.cachedData = data;
  }

  getData() {
    return this.cachedData;
  }

  hasData() {
    return this.cachedData !== undefined;
  }

  fetchCars() : Observable<CarAd[]>{
    let ads = this.http.get<CarAd[]>("https://u05-restful-api-4.onrender.com/api/carAds");
    this.setData(ads);
    return ads;
  }

  fetchById(id: string) : Observable<CarAd>{
    let carAd = this.http.get<CarAd>(`https://u05-restful-api-4.onrender.com/api/carAds/${id}`);
    return carAd;
  }

  login(username: string, password: string) {
    let authData = this.http.post<AuthData>("https://u05-restful-api-4.onrender.com/api/users/login", {username, password});

    return authData;
  }

  signup(username: string, email: string, password: string) {
    let authData = this.http.post<AuthData>("https://u05-restful-api-4.onrender.com/api/users/register", {username, email, password});

    return authData;
  }

  createAd(ad: CreateAdDTO, token: string) : Observable<CarAd> {
    let newCarAd = this.http.post<CarAd>("https://u05-restful-api-4.onrender.com/api/carAds", ad, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return newCarAd;
  }


}

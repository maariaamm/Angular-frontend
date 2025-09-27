import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import CarAd from '../models/CarAd';
import LoginResponse from '../models/LoginResponse';

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
    let something = this.http.get<CarAd[]>("https://u05-restful-api-4.onrender.com/api/carAds");
    this.setData(something);
    return something;
  }

  fetchById(id: string) : Observable<CarAd>{
    let something = this.http.get<CarAd>(`https://u05-restful-api-4.onrender.com/api/carAds/${id}`);
    return something;
  }

  login(username: string, password: string) {
    let authData = this.http.post<LoginResponse>("https://u05-restful-api-4.onrender.com/api/users/login", {username, password});

    return authData;
  }


}

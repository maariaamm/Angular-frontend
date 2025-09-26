import { Component, inject, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '../../services/http-client';
import { AsyncPipe } from '@angular/common'


@Component({
  selector: 'app-index',
  imports: [AsyncPipe],
  templateUrl: './index.html',
  styleUrl: './index.css',
  encapsulation: ViewEncapsulation.None,
})
export class Index {
  private httpClient = inject(HttpClient)
  public carsAd = this.fetchCars();

  title = "Car web site"

  constructor() {
    console.log("something", this.httpClient);
  }

  fetchCars() {
    return this.httpClient.fetchCars();
  }

}



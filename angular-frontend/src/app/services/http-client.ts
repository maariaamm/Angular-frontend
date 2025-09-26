import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpClient {
  private http = inject(HttpClient);
}

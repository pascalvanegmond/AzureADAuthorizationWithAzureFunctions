import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url = 'https://productfunction.azurewebsites.net/api/products';

  constructor(private http: HttpClient) { }

  getContent() {
    return this.http.get(this.url);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'https://userdetailsfunction.azurewebsites.net/api/users';

  constructor(private http: HttpClient) { }

  getContent() {
    return this.http.get(this.url);
  }
}

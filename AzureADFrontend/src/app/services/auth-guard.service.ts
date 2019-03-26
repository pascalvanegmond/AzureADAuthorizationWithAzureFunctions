import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Router, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(
    private authService: MsalService,
    private router: Router
  ) { }

  canActivate() {
    if (this.authService.getUser()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}

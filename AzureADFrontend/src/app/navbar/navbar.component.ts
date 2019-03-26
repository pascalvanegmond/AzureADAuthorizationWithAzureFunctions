import { Component, OnInit, OnDestroy } from '@angular/core';
import { MsalService, BroadcastService } from '@azure/msal-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  loggedIn: boolean;
  public userInfo: any = null;
  private subscription: Subscription;
  public isIframe: boolean;

  constructor(private broadcastService: BroadcastService , private authService: MsalService) {
    //  This is to avoid reload during acquireTokenSilent() because of hidden iframe
    this.isIframe = window !== window.parent && !window.opener;
    if (this.authService.getUser()) {
      this.loggedIn = true;
    } else {
     this.loggedIn = false;
   }
  }

  logout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.broadcastService.subscribe('msal:loginFailure', (payload) => {
      console.log('login failure ' + JSON.stringify(payload));
      this.loggedIn = false;
    });

    this.broadcastService.subscribe('msal:loginSuccess', (payload) => {
      console.log('login success ' + JSON.stringify(payload));
      this.loggedIn = true;
    });
  }

  ngOnDestroy() {
    this.broadcastService.getMSALSubject().next(1);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}

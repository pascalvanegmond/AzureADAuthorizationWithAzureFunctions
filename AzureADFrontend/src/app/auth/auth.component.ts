import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Config } from 'src/assets/config';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(
    private authService: MsalService
  ) { }

  async login() {
    this.authService.loginRedirect();
  }

  async getAccessToken(): Promise<string> {
    const result = await this.authService.acquireTokenSilent(Config.consentScopes)
      .catch((reason) => {
        console.log('Get token failed', JSON.stringify(reason, null, 2));
      });

    // Temporary to display token in an error box
    if (result) {
      console.log('Token acquired', result);
    }
    return result;
  }
  
  ngOnInit() {
  }

}

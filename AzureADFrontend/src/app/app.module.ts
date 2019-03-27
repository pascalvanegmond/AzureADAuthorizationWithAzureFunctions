import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MsalModule } from '@azure/msal-angular';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MsalInterceptorTmp } from './MsalInterceptorTmp';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { Config } from 'src/assets/config';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthGuard } from './services/auth-guard.service';
import { HomeComponent } from './page/home/home.component';
import { ProductComponent } from './page/product/product.component';
import { UserComponent } from './page/user/user.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    NavbarComponent,
    HomeComponent,
    ProductComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MsalModule.forRoot({
      clientID: Config.clientID,
      redirectUri: Config.redirectUri,
      consentScopes: Config.consentScopes,
      authority: Config.authority,
      postLogoutRedirectUri: Config.redirectUri,
    })
  ],
  providers: [
    AuthGuard,
    {provide: HTTP_INTERCEPTORS, useClass: MsalInterceptorTmp, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

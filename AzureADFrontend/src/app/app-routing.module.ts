import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './page/home/home.component';
import { AuthGuard } from './services/auth-guard.service';
import { ProductComponent } from './page/product/product.component';
import { UserComponent } from './page/user/user.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'login', component: AuthComponent},
  { path: 'products', component: ProductComponent, canActivate: [AuthGuard]},
  { path: 'users', component: UserComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

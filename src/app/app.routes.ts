import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { CartComponent } from './cart/cart.component';

import { ProductDetailComponent } from './main/product/product-detail.component';

import { ConfirmOrderComponent } from './cart/confirm-order.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register',component: RegisterComponent},
  { path: 'user-info', component: UserInfoComponent },
  { path: 'cart', component: CartComponent },

  { path: 'product/:id', component: ProductDetailComponent },

  { path: 'confirm', component: ConfirmOrderComponent },

];

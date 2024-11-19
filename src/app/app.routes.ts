import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { CartComponent } from './cart/cart.component';

import { ProductDetailComponent } from './main/product/product-detail.component';

import { ConfirmOrderComponent } from './cart/confirm-order.component';
import { OrderComponent } from './order/order.component';
import { PayComponent } from './pay/pay.component';
import { AboutComponent } from './about/about.component';
import { ProductSearchComponent } from './main/product/product-search.component';
import { CategoryComponent } from './main/category/category.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register',component: RegisterComponent},
  { path: 'user-info', component: UserInfoComponent },
  { path: 'cart', component: CartComponent },
  { path: 'category',component: CategoryComponent},
  { path: 'product/:id', component: ProductDetailComponent },


  { path: 'confirm', component: ConfirmOrderComponent },
  { path: 'about', component: AboutComponent },
  { path: 'pay', component: PayComponent },
  { path: 'guide', component: OrderComponent },
  { path: 'search', component: ProductSearchComponent },
];

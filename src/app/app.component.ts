import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';




// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from './services/cart.service';

import { CartComponent } from './cart/cart.component';
import { ConfirmOrderComponent } from './cart/confirm-order.component';
import { OrderSuccessComponent } from './cart/order-success.component';

import { ProductComponent } from './main/product/product.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductDetailComponent } from './main/product/product-detail.component';
import { CategoryComponent } from './main/category/category.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CategoryDetailComponent } from './main/category/category-detail.component';
import { ProductSearchComponent } from './main/product/product-search.component';


@Component({
  selector: 'app-root',  // Hoặc 'app-product' nếu bạn đang sử dụng trong product.component.ts
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterOutlet,
    HeaderComponent,
    ProductComponent,
    FooterComponent,
    MainComponent,
    ReactiveFormsModule,
    FormsModule,
    ProductDetailComponent,
    CartComponent,
    CategoryComponent,
    ConfirmOrderComponent,
    ProductSearchComponent,
    OrderSuccessComponent,
    CKEditorModule,
    CategoryDetailComponent,


  ],
  templateUrl: './app.component.html',  // Hoặc './product.component.html'
  styleUrls: ['./app.component.css'],  // Hoặc './product.component.css'
})
export class AppComponent {
  title = 'Angular Standalone Example';
}

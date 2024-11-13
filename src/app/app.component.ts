import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from './main/product/product.component';
import { HttpClientModule } from '@angular/common/http';


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
  
  ],
  templateUrl: './app.component.html',  // Hoặc './product.component.html'
  styleUrls: ['./app.component.css'],  // Hoặc './product.component.css'
})
export class AppComponent {
  title = 'Angular Standalone Example';
}

import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { CurrencyFormatPipe } from './currency-format.pipe';  // Pipe định dạng tiền tệ

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { CartService } from '../../services/cart.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic'; 


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  imports: [CommonModule, CurrencyFormatPipe],
  standalone: true,
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  errorMessage: string | null = null;
  searchTerm: string = '';

  public Editor = ClassicEditor; 

  // CKEditor configuration
  public editorConfig = {
    toolbar: [
      'bold', 'italic', 'underline', 'strikethrough', 'link', 
      'bulletedList', 'numberedList', 'blockQuote', 'imageUpload', 
      'insertTable', 'mediaEmbed', 'code', 'fontSize', 'fontColor', 
      'fontBackgroundColor', 'alignment', 'indent', 'outdent'
    ],
    language: 'en',
    image: {
      toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side', 'linkImage']
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
    },
    removePlugins: ['ImageResize', 'EasyImage']
  };

  constructor(
    private productService: ProductService, 
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadHotProducts();
  }

  loadHotProducts(): void {
    this.productService.getHotProducts().subscribe({
      next: (data) => {
        this.products = data.map(product => ({
          ...product,
          image1: this.productService.getProductImageUrl(product.image1 || 'default-image1.jpg'),
          image2: this.productService.getProductImageUrl(product.image2 || 'default-image2.jpg')
        }));
      },
      error: (err) => {
        this.errorMessage = 'Không thể tải sản phẩm nổi bật: ' + err.message;
        console.error('Error loading hot products', err);
      }
    });
  }

  viewProductDetails(productId: string): void {
    // Điều hướng đến trang chi tiết sản phẩm với id
    this.router.navigate(['/product', productId]);
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart(productId: string) {
    this.cartService.add(productId);
  }
}

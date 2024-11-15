import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { CurrencyFormatPipe } from './currency-format.pipe';  // Pipe định dạng tiền tệ
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  imports: [CommonModule, CurrencyFormatPipe],
  standalone: true,
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  errorMessage: string | null = null;

  constructor(private productService: ProductService,private router: Router) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data.map(product => ({
          ...product,
          image1: this.productService.getProductImageUrl(product.image1 || 'default-image1.jpg'),
          image2: this.productService.getProductImageUrl(product.image2 || 'default-image2.jpg')
        }));
      },
      error: (err) => {
        this.errorMessage = 'Không thể tải sản phẩm: ' + err.message;
        console.error('Error loading products', err);
      }
    });
  }
  viewProductDetails(productId: string): void {
    // Điều hướng đến trang chi tiết sản phẩm với id
    this.router.navigate(['/product', productId]);
  }

  addToCart(product: Product): void {
    console.log('Thêm vào giỏ hàng:', product);
  }
 
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { CommonModule } from '@angular/common';
import { CurrencyFormatPipe } from './currency-format.pipe';
import { Router } from '@angular/router'; 
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe]
})
export class ProductSearchComponent implements OnInit {
  searchTerm: string = '';
  products: Product[] = [];

  constructor(
    private route: ActivatedRoute, 
    private productService: ProductService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Lấy tham số tìm kiếm từ URL
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['searchTerm'] || '';
      if (this.searchTerm) {
        this.searchProducts();
      }
    });
  }

  searchProducts(): void {
    this.productService.searchProducts(this.searchTerm).subscribe((data: Product[]) => {
      this.products = data.map(product => ({
        ...product,
        image1: this.productService.getProductImageUrl(product.image1 || 'default-image1.jpg'),
        image2: this.productService.getProductImageUrl(product.image2 || 'default-image2.jpg')
    }))});
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

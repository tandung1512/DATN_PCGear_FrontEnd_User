import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { CommonModule } from '@angular/common';
import { CurrencyFormatPipe } from './currency-format.pipe';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe],
})
export class ProductSearchComponent implements OnInit {
  searchTerm: string = ''; // Từ khóa tìm kiếm
  products: Product[] = []; // Danh sách sản phẩm

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService
  ) {}
  ngOnInit(): void {
    // Lấy từ khóa tìm kiếm từ URL
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['searchTerm'] || '';
      if (this.searchTerm) {
        this.searchProducts();
      }
    });
  }

  // Gọi API để tìm kiếm sản phẩm
  searchProducts(): void {
    this.productService.searchProduct(this.searchTerm).subscribe((data: Product[]) => {
      this.products = data.map(product => ({
        ...product,
        image1: this.productService.getProductImageUrl(product.image1 || ''),
        image2: this.productService.getProductImageUrl(product.image2 || '')
      }));
    });
  }


  // Xem chi tiết sản phẩm
  viewProductDetails(productId: string): void {
    this.router.navigate(['/product', productId]);
  }
  addToCart(productId: string): void {
    this.cartService.add(productId);
    alert('Sản phẩm đã được thêm vào giỏ hàng!');
  }
}

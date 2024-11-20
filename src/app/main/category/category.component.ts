import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CurrencyFormatPipe } from '../product/currency-format.pipe';
import { Component, OnInit } from '@angular/core';
import { CategoryService } from './category.service';  // Dịch vụ lấy danh mục
import { ProductService } from '../product/product.service';  // Dịch vụ lấy sản phẩm
import { Category } from './category.model';  // Model danh mục
import { Product } from '../product/product.model';  // Model sản phẩm
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  imports: [CommonModule, CurrencyFormatPipe],
  standalone: true,
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  errorMessage: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private cartService: CartService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // Lấy danh mục từ API
  loadCategories(): void {
    this.categoryService.getHotCategories().subscribe({
      next: (data) => {
        // Lọc chỉ lấy danh mục hot
        this.categories = data.filter(category => category.isHot).map(category => {
          // Lấy ảnh sản phẩm của các sản phẩm nổi bật trong danh mục
          category.products = category.products.map(product => {
            product.image1 = this.productService.getProductImageUrl(product.image1); // Thêm đường dẫn ảnh sản phẩm
            return product;
          });
          return category;
        });
      },
      error: (err) => {
        this.errorMessage = 'Không thể tải danh mục: ' + err.message;
        console.error('Error loading categories', err);
      }
    });
  }
  

  // Lọc các sản phẩm nổi bật trong danh mục
  getHotProducts(category: Category): Product[] {
    return category.products.filter(product => product.isHot);
  }

  // Xem chi tiết sản phẩm
  viewProductDetails(productId: string): void {
    this.router.navigate(['/product', productId]);  // Điều hướng đến trang chi tiết sản phẩm
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart(productId: string) {
    this.cartService.add(productId);
  }
}

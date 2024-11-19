import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from './category.service';  // Dịch vụ lấy danh mục
import { ProductService } from '../product/product.service';  // Dịch vụ lấy sản phẩm
import { Category } from './category.model';  // Model danh mục
import { Product } from '../product/product.model';  // Model sản phẩm
import { CurrencyFormatPipe } from '../product/currency-format.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyFormatPipe], // Đảm bảo Pipe được nhập vào
})
export class CategoryDetailComponent implements OnInit {
  category: Category | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Lấy ID danh mục từ URL
    this.route.paramMap.subscribe(params => {
      const categoryId = params.get('id');
      if (categoryId) {
        this.loadCategoryDetail(categoryId);
      } else {
        this.errorMessage = 'Danh mục không hợp lệ!';
        this.router.navigate(['/categories']);  // Điều hướng về trang danh mục nếu không có ID
      }
    });
  }

  // Tải chi tiết danh mục từ API
  private loadCategoryDetail(categoryId: string): void {
    this.categoryService.getCategoryById(categoryId).subscribe({
      next: (data) => {
        // Kiểm tra và gán danh mục hoặc tạo đối tượng rỗng nếu không có sản phẩm
        this.category = data || { products: [] }; 
        
        // Lọc ảnh sản phẩm nếu danh mục có sản phẩm
        if (this.category?.products?.length) {
          this.category.products = this.category.products.map(product => {
            product.image1 = this.productService.getProductImageUrl(product.image1); // Lấy đường dẫn ảnh
            return product;
          });
        }
      },
      error: (err) => {
        this.errorMessage = 'Không thể tải thông tin danh mục!';
        console.error('Lỗi khi tải danh mục:', err);
      }
    });
  }

  // Xem chi tiết sản phẩm
  viewProductDetails(productId: string): void {
    this.router.navigate(['/product', productId]);  // Điều hướng đến trang chi tiết sản phẩm
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart(productId: string): void {
    console.log(`Thêm sản phẩm ${productId} vào giỏ hàng`);
  }
}

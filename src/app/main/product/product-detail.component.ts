import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { CurrencyFormatPipe } from './currency-format.pipe'; // Pipe định dạng tiền tệ
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  imports: [CommonModule, CurrencyFormatPipe], // Đăng ký các module và pipe cần thiết
  standalone: true,
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null; // Lưu thông tin sản phẩm
  errorMessage: string | null = null; // Thông báo lỗi (nếu có)

  constructor(
    private route: ActivatedRoute, // Để lấy thông tin ID từ URL
    private productService: ProductService, // Dịch vụ sản phẩm
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Lấy ID từ URL
    if (id) {
      this.loadProduct(id); // Tải sản phẩm dựa theo ID
    } else {
      this.errorMessage = 'Không tìm thấy ID sản phẩm.'; // Thông báo nếu không có ID
    }
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = {
          ...data,
          image1: this.productService.getProductImageUrl(data.image1 || 'default-image1.jpg'), // Thêm đường dẫn đầy đủ cho ảnh
          image2: this.productService.getProductImageUrl(data.image2 || 'default-image2.jpg') // Thêm ảnh thứ 2
        };
      },
      error: (err) => {
        this.errorMessage = 'Không thể tải sản phẩm: ' + err.message; // Xử lý lỗi
      },
    });
  }

  
  addToCart(product: Product): void {
    console.log('Sản phẩm đã thêm vào giỏ hàng:', product);
    // Logic thêm vào giỏ hàng
  }

  goHome(): void {
    this.router.navigate(['/']); // Quay lại trang trước
  }
}

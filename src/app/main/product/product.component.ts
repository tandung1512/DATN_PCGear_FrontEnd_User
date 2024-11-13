import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';  // Dịch vụ lấy dữ liệu sản phẩm
import { Product } from './product.model';  // Mô hình sản phẩm
import { CurrencyFormatPipe } from './currency-format.pipe';  // Pipe định dạng tiền tệ
import { CommonModule } from '@angular/common';  // Cần để sử dụng các tính năng chung của Angular

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  imports: [CommonModule, CurrencyFormatPipe],  // Đảm bảo Pipe và CommonModule được import đúng
  standalone: true,  // Đảm bảo component này là standalone
})
export class ProductComponent implements OnInit {
  products: Product[] = [];  // Mảng sản phẩm
  errorMessage: string | null = null;  // Biến lỗi nếu có

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();  // Gọi hàm lấy sản phẩm khi component khởi tạo
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;  // Gán dữ liệu vào mảng products
      },
      error: (err) => {
        this.errorMessage = 'Không thể tải sản phẩm: ' + err.message;
        console.error('Error loading products', err);
      }
    });
  }
}

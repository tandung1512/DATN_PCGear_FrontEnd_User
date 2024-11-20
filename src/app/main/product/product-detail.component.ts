import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { CartService } from '../../services/cart.service';
import { CurrencyFormatPipe } from './currency-format.pipe'; // Pipe định dạng tiền tệ
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'; // Import CKEditor
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  imports: [CommonModule, CurrencyFormatPipe, CKEditorModule, FormsModule], // Đăng ký các module và pipe cần thiết
  standalone: true, // Đánh dấu component là standalone
})
export class ProductDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('editor', { static: false }) editorElement!: ElementRef; // Thêm @ViewChild để tham chiếu tới phần tử CKEditor trong template

  product: Product | null = null; // Lưu thông tin sản phẩm
  errorMessage: string | null = null; // Thông báo lỗi (nếu có)

  public Editor = ClassicEditor; // Sử dụng CKEditor đã nhập

// CKEditor configuration
public editorConfig = {
  toolbar: [],  // Ẩn toolbar
  language: 'en',
  disabled:true,
};

  constructor(
    private route: ActivatedRoute, // Để lấy thông tin ID từ URL
    private productService: ProductService, // Dịch vụ sản phẩm
    private router: Router, // Để điều hướng
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Lấy ID từ URL
    if (id) {
      this.loadProduct(id); // Tải sản phẩm dựa theo ID
    } else {
      this.errorMessage = 'Không tìm thấy ID sản phẩm.'; // Thông báo nếu không có ID
    }
  }

  ngAfterViewInit(): void {
    // Khởi tạo CKEditor sau khi view đã được khởi tạo
    if (this.editorElement) {
      this.Editor.create(this.editorElement.nativeElement, this.editorConfig)
        .then(editor => {
          editor.isReadOnly = true; // Đảm bảo CKEditor ở chế độ chỉ đọc
        })
        .catch(error => {
          console.error('Có lỗi khi khởi tạo CKEditor:', error);
        });
    }
  }

  // Hàm tải sản phẩm từ dịch vụ
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

  // Thêm sản phẩm vào giỏ hàng
  addToCart(productId: string) {
    this.cartService.add(productId);
  }

  // Quay lại trang chủ
  goHome(): void {
    this.router.navigate(['/']); // Quay lại trang chủ
  }
}

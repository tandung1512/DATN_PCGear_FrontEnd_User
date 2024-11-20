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
  displayedProducts: Product[] = []; 
   // Các biến phân trang
   totalProducts: number = 0;
   pageSize: number = 12;
   currentPage: number = 1;
   totalPages: number = 1;
   pages: number[] = [];
 
   startDisplay: number = 0;
   endDisplay: number = 0;
 

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
    removePlugins: ['ImageResize', 'EasyImage'], 
    readonly:true,

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
        this.totalProducts = this.products.length;

        // Cập nhật số trang tổng cộng
        this.totalPages = this.totalProducts > 0 ? Math.ceil(this.totalProducts / this.pageSize) : 1;
  
        this.currentPage = 1; // Đặt trang đầu tiên mặc định
        this.updateDisplayedProducts();
      },
      error: (err) => {
        this.errorMessage = 'Không thể tải sản phẩm nổi bật: ' + err.message;
        console.error('Error loading hot products', err);
      }
    });
  }
  // Cập nhật danh sách sản phẩm hiển thị
  updateDisplayedProducts(): void {
    if (this.totalProducts === 0) {
      this.displayedProducts = [];
      this.pages = [];
      this.startDisplay = 0;
      this.endDisplay = 0;
      return;
    }
  
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalProducts);
    
    this.displayedProducts = this.products.slice(startIndex, endIndex);
  
    // Tạo mảng các số trang
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  
    // Cập nhật giá trị startDisplay và endDisplay
    this.startDisplay = startIndex + 1;
    this.endDisplay = endIndex;
  }
  
  changePage(page: number): void {
    // Kiểm tra nếu số trang hợp lệ
    if (page < 1 || page > this.totalPages) return;
  
    this.currentPage = page;
    this.updateDisplayedProducts();
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

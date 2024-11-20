import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from './category.service';  // Dịch vụ lấy danh mục
import { ProductService } from '../product/product.service';  // Dịch vụ lấy sản phẩm
import { Category } from './category.model';  // Model danh mục
import { Product } from '../product/product.model';  // Model sản phẩm
import { CurrencyFormatPipe } from '../product/currency-format.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-category-detail',
    templateUrl: './category-detail.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule, CurrencyFormatPipe], // Đảm bảo Pipe được nhập vào
})
export class CategoryDetailComponent implements OnInit {
    category: Category | null = null;
    errorMessage: string | null = null;

    totalProducts: number = 0;  // Tổng số sản phẩm
    pageSize: number = 10;  // Số sản phẩm mỗi trang
    currentPage: number = 1;  // Trang hiện tại
    totalPages: number = 1;  // Tổng số trang
    pages: number[] = [];  // Mảng các trang hiển thị
    startDisplay: number = 0;  // Sản phẩm đầu tiên hiển thị
    endDisplay: number = 0;  // Sản phẩm cuối cùng hiển thị

    constructor(
        private route: ActivatedRoute,
        private categoryService: CategoryService,
        private cartService: CartService,
        private productService: ProductService,
        private router: Router
    ) { }

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
                this.totalProducts = this.category?.products.length || 0;
                this.totalPages = this.calculateTotalPages();
                this.startDisplay = (this.currentPage - 1) * this.pageSize + 1;
                this.endDisplay = Math.min(this.currentPage * this.pageSize, this.totalProducts);
                this.pages = this.generatePageNumbers();
            },

            error: (err) => {
                this.errorMessage = 'Không thể tải thông tin danh mục!';
                console.error('Lỗi khi tải danh mục:', err);
            }
        });
    }

    // Tính toán tổng số trang
    private calculateTotalPages(): number {
        if (this.totalProducts === 0) return 1;
        return Math.ceil(this.totalProducts / this.pageSize); // Sử dụng Math.ceil để làm tròn lên
    }

    // Sinh danh sách các trang để điều hướng
    private generatePageNumbers(): number[] {
        const pageNumbers: number[] = [];
        for (let i = 1; i <= this.totalPages; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    }
    
    // Xem chi tiết sản phẩm
    viewProductDetails(productId: string): void {
        this.router.navigate(['/product', productId]);  // Điều hướng đến trang chi tiết sản phẩm
    }

    // Thêm sản phẩm vào giỏ hàng
    addToCart(productId: string) {
        this.cartService.add(productId);
      }

    // Thay đổi trang hiện tại
    changePage(page: number): void {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.startDisplay = (this.currentPage - 1) * this.pageSize + 1;
        this.endDisplay = Math.min(this.currentPage * this.pageSize, this.totalProducts);
        this.loadCategoryDetail(this.route.snapshot.paramMap.get('id')!); // Tải lại danh mục với trang mới
    }
}

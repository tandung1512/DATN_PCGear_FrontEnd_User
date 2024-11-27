import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from './category.service';
import { ProductService } from '../product/product.service';
import { Category } from './category.model';
import { Product } from '../product/product.model';
import { CurrencyFormatPipe } from '../product/currency-format.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-category-detail',
    templateUrl: './category-detail.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule, CurrencyFormatPipe],
})
export class CategoryDetailComponent implements OnInit {
    category: Category | null = null; // Thông tin danh mục hiện tại
    errorMessage: string | null = null; // Lỗi nếu xảy ra khi tải danh mục
    displayedProducts: Product[] = []; // Sản phẩm hiển thị trên trang

    // Phân trang
    totalProducts: number = 0;
    pageSize: number = 9; 
    currentPage: number = 1;
    totalPages: number = 1;
    pages: number[] = []; 
    startDisplay: number = 0;  // Sản phẩm đầu tiên hiển thị
    endDisplay: number = 0;  // Sản phẩm cuối cùng hiển thị
    
    

    constructor(
        private route: ActivatedRoute,
        private categoryService: CategoryService,
        private productService: ProductService,
        private cartService: CartService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const categoryId = params.get('id');
            if (categoryId) {
                this.loadCategoryDetail(categoryId);
                
            } else {
                this.handleInvalidCategory();
            }
        });
    }

    // Xử lý khi danh mục không hợp lệ
    private handleInvalidCategory(): void {
        this.errorMessage = 'Danh mục không hợp lệ!';
        this.router.navigate(['/categories']);
    }

    // Tải chi tiết danh mục từ API
    private loadCategoryDetail(categoryId: string): void {
        this.categoryService.getCategoryById(categoryId).subscribe({
            next: (data) => this.handleCategoryData(data),
            error: (err) => {
                this.errorMessage = 'Không thể tải thông tin danh mục!';
                console.error('Lỗi khi tải danh mục:', err);
            }
        });
    }

    // Xử lý dữ liệu danh mục trả về
    private handleCategoryData(data: Category): void {
        this.category = data || { products: [] };

        // Xử lý ảnh sản phẩm
        if (this.category.products?.length) {
            this.category.products = this.category.products.map(product => ({
                ...product,
                image1: this.productService.getProductImageUrl(product.image1)
            }));
        }

        // Cập nhật thông tin phân trang
        this.totalProducts = this.category.products.length;
        this.totalPages = this.calculateTotalPages();
        this.pages = this.generatePageNumbers();

        // Hiển thị sản phẩm cho trang đầu tiên
        this.updateDisplayedProducts();
    }

    // Tính toán tổng số trang
    private calculateTotalPages(): number {
        return Math.max(1, Math.ceil(this.totalProducts / this.pageSize));
    }

    // Tạo danh sách số trang
    private generatePageNumbers(): number[] {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    // Cập nhật sản phẩm hiển thị trên trang hiện tại
    private updateDisplayedProducts(): void {
        if (!this.category) return;

        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = Math.min(this.currentPage * this.pageSize, this.totalProducts);

        this.displayedProducts = this.category.products.slice(startIndex, endIndex);
    }

    // Chuyển sang trang mới
    changePage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.updateDisplayedProducts();
        }
    }

    // Xem chi tiết sản phẩm
    viewProductDetails(productId: string): void {
        this.router.navigate(['/product', productId]);
    }

    // Thêm sản phẩm vào giỏ hàng
    addToCart(productId: string): void {
        this.cartService.add(productId);
    }
}

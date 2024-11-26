import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Account } from '../account/account.model';
import { CartService } from '../services/cart.service';
import { ProductService } from '../main/product/product.service';
import { Product } from '../main/product/product.model';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../main/category/category.service';
import { Category } from '../main/category/category.model';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [CommonModule,
    FormsModule],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  userName: string = '';
  isAdmin: boolean = false;
  cartOpen = false;
  searchTerm: string = '';
  products: Product[] = [];
  categories: Category[] = [];  // Định nghĩa allCategories
  errorMessage: string | null = null;
  selectedBanner: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    public cartService: CartService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private routeAc: ActivatedRoute,
    
  ) { }


  // Lấy số lượng sản phẩm trong giỏ hàng từ CartService
  get cartCount(): number {
    return this.cartService.count; // Lấy số lượng sản phẩm từ CartService
  }
  get cartItems() {
    return this.cartService.items;
  }
  get cartAmount(): number {
    return this.cartService.amount;
  }
  ToCart() {
    this.cartOpen = false;
    this.router.navigate(['/cart']);
  }

  toggleCartDropdown() {
    this.cartOpen = !this.cartOpen;
  }

  removeItem(itemId: string) {
    this.cartService.remove(itemId);
  }


  ngOnInit(): void {
    this.checkLoginStatus(); // Kiểm tra trạng thái đăng nhập khi component được khởi tạo
    this.loadCategories();
     
    
  }

  // Kiểm tra trạng thái đăng nhập và cập nhật thông tin người dùng
  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const userData: Account | null = this.authService.getUserData();
      if (userData) {
        this.userName = userData.name || 'User';
        this.isAdmin = userData.admin;
      }
    }
  }

  // Điều hướng đến trang Login
  login(): void {
    this.router.navigate(['/login']);
  }

  // Điều hướng đến trang Register
  register(): void {
    this.router.navigate(['/register']);
  }

  // Điều hướng đến trang hồ sơ người dùng
  goToUserProfile(): void {
    this.router.navigate(['/user-info']);
  }

  // Đăng xuất và xoá dữ liệu phiên làm việc
  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userName = '';
    this.isAdmin = false;
    this.router.navigate(['/']);
  }

  onSearch(): void {
    this.router.navigate(['/search'], { queryParams: { searchTerm: this.searchTerm } });
  }

  navigateToAbout() {
    this.router.navigate(['/about']);  // Điều hướng đến trang Giới thiệu
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data; // Lưu danh mục vào biến categories
      },
      error: (err) => {
        this.errorMessage = 'Không thể tải danh mục!';
        console.error('Error loading categories', err);
      }
    });
  }

  // Điều hướng đến trang danh mục
  goToCategory(categoryId: string ,event: MouseEvent): void {
    event.preventDefault();
    this.router.navigate([`/category/${categoryId}`]);  // Điều hướng đến trang danh mục
  }
  
}

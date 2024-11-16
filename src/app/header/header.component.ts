import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Account } from '../account/account.model';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [CommonModule],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  userName: string = '';
  isAdmin: boolean = false;
  cartOpen = false;
 
  constructor(
    private router: Router, 
    private authService: AuthService, 
    public cartService: CartService
  ) {}

  
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
}

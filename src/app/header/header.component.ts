import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Account } from '../account/account.model';


interface CartItem {
  id: number;
  name: string;
  image1: string;
  price: number;
  qty: number;
}

interface Cart {
  count: number;
  items: CartItem[];
  amount: number;
}
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
  cart: Cart = {
    count: 0,
    items: [],
    amount: 0,
  };

  constructor(private router: Router, private authService: AuthService, ) {
  
  }
  loadCartData() {
    // Giả sử dữ liệu giỏ hàng được lấy từ một API hoặc local storage
    this.cart = {
      count: 2,
      items: [
        { id: 1, name: 'Sản phẩm A', image1: 'product1.jpg', price: 100000, qty: 1 },
        { id: 2, name: 'Sản phẩm B', image1: 'product2.jpg', price: 200000, qty: 2 },
      ],
      amount: 500000,
    };
  }

  toggleCartDropdown() {
    this.cartOpen = !this.cartOpen;
  }

  removeItem(itemId: number) {
    this.cart.items = this.cart.items.filter((item) => item.id !== itemId);
    this.updateCartCountAndAmount();
  }

  updateCartCountAndAmount() {
    this.cart.count = this.cart.items.length;
    this.cart.amount = this.cart.items.reduce((acc, item) => acc + item.price * item.qty, 0);
  }

  ngOnInit(): void {
    this.checkLoginStatus(); // Kiểm tra trạng thái đăng nhập khi component được khởi tạo
    this.loadCartData();
  }

  // Kiểm tra trạng thái đăng nhập và cập nhật thông tin người dùng
  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const userData: Account | null = this.authService.getUserData();
      console.log("User Data:", userData); // In ra toàn bộ dữ liệu người dùng
      if (userData) {
        this.userName = userData.name || 'User';
        console.log("User Name:", this.userName); // In ra tên người dùng hoặc tên mặc định
        this.isAdmin = userData.admin;
        console.log("User is Admin:", this.isAdmin);
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
    this.authService.logout(); // Xoá phiên làm việc với AuthService
    this.isLoggedIn = false;
    this.userName = ''; // Xoá tên người dùng sau khi đăng xuất
    this.isAdmin = false; // Xoá quyền admin sau khi đăng xuất
    this.router.navigate(['/']); // Điều hướng về trang chủ
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Account } from '../account/account.model';

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

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.checkLoginStatus(); // Kiểm tra trạng thái đăng nhập khi component được khởi tạo
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
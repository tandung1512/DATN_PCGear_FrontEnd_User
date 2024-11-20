import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Account } from '../account/account.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apiService: ApiService, private router: Router) {}

  login(id: string, password: string): Observable<string> {
    const body = { id, password };
    return this.apiService.post<{ token: string; id: string; name: string; phone: string; email: string; address: string; admin: boolean }>('auth/login', body).pipe(
      tap(response => {
        console.log("API Response:", response); // Ghi lại toàn bộ phản hồi từ API để kiểm tra cấu trúc của nó
        sessionStorage.setItem('authToken', response.token); // Lưu token vào sessionStorage
  
        // Lưu trữ dữ liệu người dùng trực tiếp vào sessionStorage
        sessionStorage.setItem('userData', JSON.stringify({
          id: response.id,
          name: response.name,
          phone: response.phone,
          email: response.email,
          address: response.address,
          admin: response.admin
        }));
  
        this.router.navigate(['/']).then(() => {
          location.reload();
        })
      }),
      map(response => response.token)
    );
  }

  // Phương thức đăng xuất để xóa token và dữ liệu người dùng
  logout(): void {
    sessionStorage.removeItem('authToken'); // Xóa token khỏi sessionStorage
    sessionStorage.removeItem('userData');  // Xóa dữ liệu người dùng khỏi sessionStorage
    this.router.navigate(['/login']); // Điều hướng đến trang đăng nhập
  }

  // Lấy dữ liệu người dùng (Account) từ sessionStorage với xử lý lỗi
  getUserData(): Account | null {
    const userData = sessionStorage.getItem('userData');
    
    // Kiểm tra xem userData có tồn tại và không bị đặt thành "undefined" hoặc null
    if (!userData || userData === "undefined") {
      return null; // Trả về null nếu không tìm thấy dữ liệu người dùng hợp lệ
    }
  
    try {
      return JSON.parse(userData) as Account; // Phân tích cú pháp và ép kiểu thành Account
    } catch (error) {
      console.error("Lỗi khi phân tích dữ liệu người dùng từ sessionStorage", error);
      sessionStorage.removeItem('userData'); // Xóa dữ liệu không hợp lệ khỏi sessionStorage
      return null; // Trả về null nếu có lỗi
    }
  }

  // Lấy ID của người dùng từ dữ liệu người dùng đã lưu trữ
  getUserId(): string | null {
    return this.getUserData()?.id || null; // Sử dụng optional chaining cho đơn giản
  }

  // Kiểm tra xem người dùng đã đăng nhập chưa dựa trên sự tồn tại của token
  isLoggedIn(): boolean {
    return this.getToken() !== null; // Trả về true nếu token tồn tại
  }

  // Kiểm tra xem người dùng đã đăng nhập có quyền admin không
  isAdmin(): boolean {
    const userData = this.getUserData();
    if (userData && userData.admin !== undefined) {
      return userData.admin; // Trả về true nếu người dùng là admin
    }
    return false; // Trả về false nếu không có quyền admin
  }

  // Lấy token từ sessionStorage
  getToken(): string | null {
    return sessionStorage.getItem('authToken'); // Trả về token hoặc null
  }
}
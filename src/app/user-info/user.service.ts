import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../account/account.model';
// Đảm bảo rằng bạn đã tạo model Account

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api'; 

  constructor(private http: HttpClient) {}

  // Lấy thông tin người dùng từ API
  getUserInfo(userId: string): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/accounts/profile/${userId}`);
  }

  // Cập nhật thông tin người dùng
  updateUserInfo(userId: string, userData: Account): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/accounts/profile/${userId}`, userData);
  }
}

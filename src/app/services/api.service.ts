import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:8080/api';  // URL gốc

  constructor(private http: HttpClient) {}

  // Phương thức tạo URL đầy đủ từ path
  apiUrl(path: string): string {
    return `${this.baseUrl}/${path}`;
  }

  // Lấy đường dẫn hình ảnh cho sản phẩm (có thể thay đổi thư mục nếu cần)
  getImageUrl(imageName: string): string {
    const fileName = imageName.split(/(\\|\/)/).pop();  // Tách và lấy phần tên tệp cuối cùng
    return `${this.baseUrl}/products/images/${fileName}`;  // Tạo URL hợp lệ
  }

  // GET request
  get<T>(path: string, options = {}): Observable<T> {
    return this.http.get<T>(this.apiUrl(path), { ...options, observe: 'body' });
  }

  // POST request
  post<T>(path: string, body: any, options = {}): Observable<T> {
    return this.http.post<T>(this.apiUrl(path), body, { ...options, observe: 'body' });
  }

  // PUT request
  put<T>(path: string, body: any, options = {}): Observable<T> {
    return this.http.put<T>(this.apiUrl(path), body, { ...options, observe: 'body' });
  }

  // DELETE request
  delete<T>(path: string, options = {}): Observable<T> {
    return this.http.delete<T>(this.apiUrl(path), { ...options, observe: 'body' });
  }
}

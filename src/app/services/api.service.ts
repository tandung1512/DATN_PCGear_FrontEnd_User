import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:8080/api'; // URL gốc

  constructor(private http: HttpClient) {}

  // Phương thức tạo URL đầy đủ từ path
  apiUrl(path: string): string {
    return `${this.baseUrl}/${path}`;
  }

  // Lấy đường dẫn hình ảnh cho sản phẩm (có thể thay đổi thư mục nếu cần)
  getImageUrl(imageName: string): string {
    const fileName = imageName.split(/(\\|\/)/).pop(); // Tách và lấy phần tên tệp cuối cùng
    return `${this.baseUrl}/products/images/${fileName}`; // Tạo URL hợp lệ
  }

  // Hàm lấy token từ sessionStorage
  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // GET request
  get<T>(endpoint: string): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}/${endpoint}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // POST request
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}/${endpoint}`, data, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // PUT request
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}/${endpoint}`, data, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // DELETE request
  delete<T>(endpoint: string): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}/${endpoint}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Xử lý lỗi chung
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => new Error(error.error?.message || 'Server Error'));
  }
}

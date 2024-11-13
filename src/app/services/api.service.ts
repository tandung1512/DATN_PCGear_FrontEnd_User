import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

   // GET request
   get<T>(endpoint: string, options = {}): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { ...options, observe: 'body' });
  }

  // POST request
  post<T>(endpoint: string, body: any, options = {}): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, { ...options, observe: 'body' });
  }

  // PUT request
  put<T>(endpoint: string, body: any, options = {}): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body, { ...options, observe: 'body' });
  }

  // DELETE request
  delete<T>(endpoint: string, options = {}): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, { ...options, observe: 'body' });
  }

  // Các phương thức lấy sản phẩm
  getAllProducts(endpoint: string): Observable<any> {
    return this.get<any>(endpoint);  // Sử dụng phương thức get để lấy sản phẩm
  }

  // Phương thức lấy sản phẩm theo ID
  getProductById(endpoint: string, id: string): Observable<any> {
    return this.get<any>(`${endpoint}/${id}`);  // Sử dụng phương thức get với ID sản phẩm
  }
}


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Category } from './category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = 'http://localhost:8080/api/categories';
  private imageUrl = 'http://localhost:8080/api/products/images/';

  constructor(private apiService: ApiService, private http: HttpClient) { }

  // Lấy tất cả danh mục nổi bật
  getHotCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/hot`);
  }
  // Lấy danh mục từ API
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }
  // Lấy tất cả danh mục
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/get/all`);
  }
  // Lấy danh mục theo ID
  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/get/${id}`);
  }
  // Lấy link ảnh của sản phẩm trong danh mục
  getImageUrl(imageName: string): string {
    return `${this.imageUrl}${imageName}`; // Trả về đường dẫn ảnh đầy đủ
  }

  // Lấy danh mục nổi bật (kèm sản phẩm nổi bật)
  getHotCategoriesWithHotProducts(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/hot-with-products`);
  }

    // Phương thức để lấy danh mục với phân trang
  getCategoryByIdPanage(id: string, page: number = 1, size: number = 10): Observable<Category> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Category>(`${this.baseUrl}/get/${id}`, { params });
  }
}

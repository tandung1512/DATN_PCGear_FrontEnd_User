import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { Category } from './category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = 'http://localhost:8080/api/categories';
  private imageUrl = 'http://localhost:8080/api/products/images/'; 

  constructor(private apiService: ApiService, private http: HttpClient) {}

  // Lấy tất cả danh mục nổi bật
  getHotCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/hot`);
  }
    // Lấy danh mục từ API
    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.baseUrl);
      }
  // Lấy danh mục theo ID
  getCategoryById(id: string): Observable<Category> {
    return this.apiService.get<Category>(`categories/${id}`);
  }
   // Lấy link ảnh của sản phẩm trong danh mục
   getImageUrl(imageName: string): string {
    return `${this.imageUrl}${imageName}`; // Trả về đường dẫn ảnh đầy đủ
  }

  // Lấy danh mục nổi bật (kèm sản phẩm nổi bật)
  getHotCategoriesWithHotProducts(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/hot-with-products`);
  }
}

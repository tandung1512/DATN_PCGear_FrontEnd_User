// src/app/product/product.service.ts
import { Injectable } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';
import { Product } from './product.model';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private apiService: ApiService, private http: HttpClient) {}

  // Lấy tất cả sản phẩm
  getAllProducts(): Observable<Product[]> {
    return this.apiService.get<Product[]>('products');
  }

  // Lấy sản phẩm theo ID
  getProductById(id: string): Observable<Product> {
    // return this.apiService.get<Product>(`products/${id}`);
    return this.http.get<Product>(`${this.baseUrl}/get/${id}`);
  }

  // Lấy URL của ảnh sản phẩm
  getProductImageUrl(imageName: string): string {
    return this.apiService.getImageUrl(imageName);
  }
  
  // searchProducts(name: string): Observable<Product[]> {
  //   return this.http.get<any>(`${this.baseUrl}/search/item?name=${encodeURIComponent(name)}`);
  // }

    // Gọi API tìm kiếm sản phẩm theo tên
    searchProduct(name: string): Observable<Product[]> {
      const url = `${this.baseUrl}/search/item?name=${name}`;
      return this.http.get<Product[]>(url);
    }
  
   // Lấy tất cả sản phẩm nổi bật (isHot = true)
   getHotProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/hot`);
  }
  updateProductQuantity(productId: string, quantity: number) {
    return this.http.put(
      `${this.baseUrl}/${productId}/update-quantity`,
      null,
      {
        params: { quantity: quantity.toString() },
        responseType: 'text', // Thêm responseType để chấp nhận plain text
      }
    );
  }
  

}

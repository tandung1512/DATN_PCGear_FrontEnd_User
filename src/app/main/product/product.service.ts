// src/app/product/product.service.ts
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Product } from './product.model';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private apiService: ApiService) {}

  // Lấy tất cả sản phẩm
  getAllProducts(): Observable<Product[]> {
    return this.apiService.get<Product[]>('products');
  }

  // Lấy sản phẩm theo ID
  getProductById(id: string): Observable<Product> {
    return this.apiService.get<Product>(`products/${id}`);
  }

  // Lấy URL của ảnh sản phẩm
  getProductImageUrl(imageName: string): string {
    return this.apiService.getImageUrl(imageName);
  }
}

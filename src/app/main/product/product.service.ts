import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';  // Ensure the correct path to ApiService
import { HttpClient, HttpEvent } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private endpoint: string = 'products';  // Define the API endpoint for products

  constructor(private apiService: ApiService) {}


  // Lấy tất cả sản phẩm
  getAllProducts(): Observable<any> {
    return this.apiService.getAllProducts(this.endpoint);  // Truyền endpoint để lấy sản phẩm
  }

  // Lấy sản phẩm theo ID
  getProductById(id: string): Observable<any> {
    return this.apiService.getProductById(this.endpoint, id);  // Truyền endpoint và id
  }
}

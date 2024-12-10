import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  items: any[] = [];  // Giỏ hàng trong bộ nhớ
  private storageKey = 'cart';  // Khóa lưu giỏ hàng trong localStorage
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private apiservice: ApiService) {
    this.loadFromLocalStorage();  // Tải giỏ hàng từ localStorage khi khởi tạo
  }

  
  
  getProduct(id: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/products/get/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Lỗi khi lấy sản phẩm:', error);
        return throwError(() => new Error('Không thể lấy sản phẩm'));
      })
    );
  }
  
  add(id: string) {
    const existingItem = this.items.find(item => item.id === id);
  
    if (existingItem) {
      if (existingItem.qty < existingItem.quantity) { 
        existingItem.qty++;
        this.saveToLocalStorage();
      } else {
        alert('Số lượng sản phẩm đã đạt giới hạn trong kho!');
      }
    } else {
      this.getProduct(id).subscribe(
        (product) => {
          if (product.quantity > 0) { 
            product.qty = 1; 
            product.imageUrl = this.apiservice.getImageUrl(product.image1);
            this.items.push(product);
            this.saveToLocalStorage();
          } else {
            alert('Sản phẩm này hiện đã hết hàng!');
          }
        },
        (error) => {
          console.error('Không thể thêm sản phẩm vào giỏ:', error);
          alert('Lỗi: Không thể thêm sản phẩm vào giỏ hàng');
        }
      );
    }
  }
  





  // Xóa sản phẩm khỏi giỏ hàng
  remove(id: string) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index > -1) {
      this.items.splice(index, 1);
      this.saveToLocalStorage();
     
    }
  }

  // Xóa hết giỏ hàng
  clear() {
    this.items = [];
    this.saveToLocalStorage();
    alert('Giỏ hàng đã được xóa.');
  }

  // Lấy tổng số lượng sản phẩm trong giỏ
  get count(): number {
    return this.items.reduce((total, item) => total + item.qty, 0);
  }

  // Lấy tổng giá trị của các sản phẩm trong giỏ
  get amount(): number {
    return this.items.reduce((total, item) => total + item.qty * item.price, 0);
  }

  // Lưu giỏ hàng vào localStorage
  private saveToLocalStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (error) {
      console.error('Không thể lưu giỏ hàng vào localStorage:', error);
    }
  }

  // Đọc giỏ hàng từ localStorage
  private loadFromLocalStorage() {
    try {
      const json = localStorage.getItem(this.storageKey);
      if (json) {
        this.items = JSON.parse(json);
      }
    } catch (error) {
      console.error('Không thể đọc giỏ hàng từ localStorage:', error);
      this.items = [];
    }
  }

  // Giảm số lượng sản phẩm
  decreaseQuantity(item: any) {
    if (item.qty > 1) {
      item.qty--;
      this.saveToLocalStorage();
    }
  }

  // Tăng số lượng sản phẩm
  increaseQuantity(item: any) {
    if (item.qty < item.quantity) {
      item.qty++;
      this.saveToLocalStorage();
    }
  }
  getCheckedItems() {
    return this.items.filter(item => item.checked);
  }
  clearSelectedItems(selectedItems: any[]) {
    this.items = this.items.filter(
      item => !selectedItems.some(selected => selected.id === item.id)
    );
    this.saveToLocalStorage();
  }
  
}

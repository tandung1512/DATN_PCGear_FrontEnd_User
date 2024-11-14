// cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  items: any[] = [];

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  // Lấy URL hình ảnh
  url(filename: string): string {
    return `http://localhost:8088/api/files/images/${filename}`;
  }

  // Thêm sản phẩm vào giỏ hàng
  add(id: string) {
    const item = this.items.find((item) => item.id === id);
    if (item) {
      item.qty++;
    } else {
      this.http.get<any>(`api/product/${id}`).subscribe((resp) => {
        resp.qty = 1;
        this.items.push(resp);
      });
    }
    this.saveToLocalStorage();
  }

  // Xóa sản phẩm khỏi giỏ hàng
  remove(id: string) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index > -1) {
      this.items.splice(index, 1);
    }
    this.saveToLocalStorage();
  }

  // Xóa hết giỏ hàng
  clear() {
    this.items = [];
    this.saveToLocalStorage();
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
  saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  // Đọc giỏ hàng từ localStorage
  loadFromLocalStorage() {
    const json = localStorage.getItem('cart');
    this.items = json ? JSON.parse(json) : [];
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
}

// shopping-cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import 'bootstrap';  // Import toàn bộ Bootstrap (JS và CSS)


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  standalone: true, 
  imports: [FormsModule,CommonModule],
})
export class CartComponent {
 
  checkAll = false;

  constructor(public cartService: CartService) {}

  // Để kiểm tra xem có sản phẩm được chọn hay không
  hasCheckedItems(): boolean {
    return this.cartService.items.some(item => item.checked);
  }

  // Tính tổng giá trị của các sản phẩm đã chọn
  getTotalAmount(): number {
    return this.cartService.items
      .filter(item => item.checked)
      .reduce((total, item) => total + item.qty * item.price, 0);
  }

  // Hàm xử lý thay đổi trạng thái "Chọn tất cả"
  checkAllItems() {
    this.cartService.items.forEach(item => item.checked = this.checkAll);
  }
 // Hàm xử lý khi nhấn "Xóa tất cả"
 clearCart() {
  this.cartService.clear();  // Gọi phương thức clear() của CartService để xóa tất cả sản phẩm
  this.checkAll = false; 

 }
   // Xác nhận xóa giỏ hàng
   confirmClearCart() {
    this.cartService.clear();  // Gọi phương thức clear() để xóa tất cả sản phẩm
    this.closeDropdown(); // Đóng dropdown sau khi xóa
  }
  closeDropdown() {
    const dropdown = document.getElementById('dropdownMenuButton');
    if (dropdown) {
      // Đóng dropdown bằng cách ẩn nó
      (dropdown as HTMLElement).click();
    }
  }
  }
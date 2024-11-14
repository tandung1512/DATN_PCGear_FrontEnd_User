// shopping-cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  standalone: true, 
  imports: [FormsModule,CommonModule],
})
export class CartComponent implements OnInit {
  checkAll: boolean = false;

  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    const sampleItems = [
      { id: 1, name: 'Sản phẩm A', price: 100000, qty: 2, image1: 'productA.jpg', checked: true, quantity: 5 },
      { id: 2, name: 'Sản phẩm B', price: 200000, qty: 1, image1: 'productB.jpg', checked: false, quantity: 3 },
    ];

    // Gán sản phẩm mẫu vào giỏ hàng
    this.cartService.items = sampleItems;
  }

  // Kiểm tra xem có sản phẩm nào được chọn không
  hasCheckedItems(): boolean {
    return this.cartService.items.some(item => item.checked);
  }

  // Chọn hoặc bỏ chọn tất cả sản phẩm trong giỏ
  checkAllItems(): void {
    this.cartService.items.forEach(item => item.checked = this.checkAll);
  }

  // Tính tổng số tiền cho các sản phẩm đã chọn
  getTotalAmount(): number {
    return this.cartService.items.reduce((total, item) => {
      return item.checked ? total + item.qty * item.price : total;
    }, 0);
  }
}

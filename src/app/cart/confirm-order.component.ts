import { Component } from '@angular/core';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
 
})
export class ConfirmOrderComponent {
  userLogged = { name: 'Nguyễn Văn A', phone: '0123456789' }; // Dữ liệu người dùng (ví dụ)
  cities = [{ Name: 'Hà Nội', Districts: [{ Name: 'Ba Đình', Wards: [{ Name: 'Ward 1' }] }] }]; // Dữ liệu thành phố, quận, phường
  selectedCity: any = null;
  selectedDistrict: any = null;
  selectedWard: any = null;
  specificAddress: string = '';
  selectedPaymentMethod: string = 'Thanh toán khi nhận hàng';
  selectedItems = [{ name: 'Sản phẩm 1', price: 100000, qty: 2, image1: 'product1.jpg' }]; // Sản phẩm trong giỏ hàng

  // Tính tổng tiền
  getTotalAmountConfirm(): number {
    return this.selectedItems.reduce((total, item) => total + (item.price * item.qty), 0);
  }

  confirmOrder() {
    console.log('Đơn hàng đã được xác nhận');
    // Xử lý logic xác nhận đơn hàng ở đây
  }
}

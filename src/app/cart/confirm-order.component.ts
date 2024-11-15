import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class ConfirmOrderComponent implements OnInit {
  orderForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  selectedItems: any[] = [];
  totalAmount: number = 0;
  addressForm: FormGroup;
  cities: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  
  selectedCity: any = null;
  selectedDistrict: any = null;
  selectedWard: any = null;
  specificAddress: string = '';

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router,
    private http: HttpClient
  ) {
    // Khởi tạo form cho thông tin người nhận
    this.orderForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
      paymentMethod: ['Thanh toán khi nhận hàng', Validators.required]
    });

    // Khởi tạo form cho địa chỉ
    this.addressForm = this.fb.group({
        selectedCity: [null, Validators.required],
        selectedDistrict: [null, Validators.required],
        selectedWard: [null, Validators.required],
        specificAddress: [this.specificAddress, Validators.required]
    });

    // Lắng nghe sự thay đổi để cập nhật địa chỉ
    this.addressForm.valueChanges.subscribe(() => {
      this.constructAddress();
    });
  }

  ngOnInit() {
    // Lấy danh sách sản phẩm từ CartService
    this.selectedItems = this.cartService.items.filter(item => item.checked);
    console.log('FormControl selectedCity:', this.addressForm.get('selectedCity'));
  console.log('FormControl selectedDistrict:', this.addressForm.get('selectedDistrict'));
  console.log('FormControl specificAddress:', this.addressForm.get('specificAddress'));
    // Tải danh sách thành phố
    this.loadCities();
  }
  
  loadCities(): void {
    this.http.get<any[]>('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
      .subscribe(data => {
        this.cities = data;
        console.log('Dữ liệu thành phố: ', this.cities); 
      });
  }

  updateDistricts(): void {
    if (this.selectedCity) {
      this.districts = this.selectedCity.Districts || [];
      this.selectedDistrict = null;
      this.selectedWard = null;
      this.wards = [];
      // Reset lại các giá trị của form để tránh trường hợp undefined
      this.addressForm.controls['selectedDistrict'].setValue(null);
      this.addressForm.controls['selectedWard'].setValue(null);
    }
  }
  
  updateWards(): void {
    if (this.selectedDistrict) {
      this.wards = this.selectedDistrict.Wards || [];
      this.selectedWard = null;
      // Reset lại giá trị của form để tránh trường hợp undefined
      this.addressForm.controls['selectedWard'].setValue(null);
    }
  }
  
  constructAddress(): void {
    const { selectedCity, selectedDistrict, selectedWard, specificAddress } = this.addressForm.value;
    if (selectedCity && selectedDistrict && selectedWard) {
      this.specificAddress = `${specificAddress}, ${selectedWard.Name}, ${selectedDistrict.Name}, ${selectedCity.Name}`;
      this.addressForm.controls['specificAddress'].setValue(this.specificAddress);
    }
  }
  

  onSubmit(): void {
    if (this.addressForm.invalid) {
      alert('Vui lòng điền đầy đủ thông tin địa chỉ!');
      return;
    }

    console.log('Địa chỉ hoàn chỉnh: ', this.specificAddress);
    // Tiến hành xử lý đặt hàng tại đây, ví dụ gửi lên server.
  }

  // Tính tổng tiền của các sản phẩm đã chọn
  getTotalAmount(): number {
    return this.selectedItems.reduce((total, item) => total + item.qty * item.price, 0);
  }

  // Xác nhận đặt hàng
  confirmOrder() {
    if (this.orderForm.valid && this.addressForm.valid) {
      // Tạo dữ liệu đơn hàng
      const orderData = {
        ...this.orderForm.value,
        address: this.specificAddress,
        products: this.selectedItems,
        totalAmount: this.getTotalAmount()
      };

      console.log('Đơn hàng đã được xác nhận:', orderData);

      // Hiển thị thông báo thành công và điều hướng về trang chủ sau 3 giây
      this.successMessage = 'Đơn hàng của bạn đã được xác nhận!';
      setTimeout(() => {
        this.cartService.clear(); // Xóa giỏ hàng sau khi đặt hàng thành công
        this.router.navigate(['/']);
      }, 3000);
    } else {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin.';
    }
  }
}

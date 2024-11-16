import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Account } from '../account/account.model';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LocationService } from './location.service';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ConfirmOrderComponent implements OnInit {
  userInfoForm: FormGroup;
  userId: string | undefined;
  account: Account | undefined;
  errorMessage = '';
  successMessage = '';
  totalAmount: number = 0;
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private cartService: CartService,  // Dịch vụ giỏ hàng
    private router: Router,
    private locationService: LocationService
  ) {
    this.userInfoForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      province: ['', Validators.required],
      district: ['', Validators.required],
      ward: ['', Validators.required],
      image: [null]
    });
  }

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']); // Nếu không có token, chuyển hướng tới trang đăng nhập
      return;
    }
  
    this.loadUserProfile();
    this.calculateTotalAmount();
 // Tải danh sách tỉnh
 this.locationService.getLocations().subscribe((data: any) => {
  console.log('Dữ liệu các tỉnh đã được tải:', data); // Kiểm tra dữ liệu tỉnh
  this.provinces = data.map((province: any) => ({
    id: province.Id,
    name: province.Name,
    districts: province.Districts
  }));
}, error => {
  console.error('Lỗi khi tải dữ liệu tỉnh:', error);
});
}



onProvinceChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const provinceId = target.value;

  if (provinceId) {
    this.userInfoForm.patchValue({ province: provinceId });

    // Tìm tỉnh trong danh sách provinces
    const selectedProvince = this.provinces.find(p => p.id === provinceId);

    if (selectedProvince) {
      this.districts = selectedProvince.districts;  // Cập nhật districts dựa trên tỉnh
      console.log('Dữ liệu quận/huyện:', this.districts);  // Kiểm tra dữ liệu districts
    }

    this.userInfoForm.patchValue({ district: '', ward: '' });  // Reset district và ward
  }
}



onDistrictChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const districtId = target.value;  // Đảm bảo bạn lấy đúng giá trị của option được chọn

  console.log('District ID:', districtId);  // Log giá trị District ID để kiểm tra

  // Cập nhật giá trị trong form
  this.userInfoForm.patchValue({ district: districtId });
}


  loadUserProfile(): void {
    this.apiService.get<Account>('accounts/profile').subscribe({
      next: (response: Account) => {
        this.account = response;
        this.userId = response.id;
        this.userInfoForm.patchValue({
          name: this.account.name,
          phone: this.account.phone,
          email: this.account.email,
          address: this.account.address  // Chỉ sử dụng address từ account
        });
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.errorMessage = 'Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.';
      }
    });
  }
  
  // Tính tổng tiền cho đơn hàng
  calculateTotalAmount(): void {
    this.totalAmount = this.cartService.items.reduce((total, item) => total + item.qty * item.price, 0);
  }

  // Xử lý xác nhận đơn hàng và gửi thông tin
  confirmOrder(): void {
    if (this.userInfoForm.valid) {
      const orderData = {
        userId: this.userId,
        address: this.buildFullAddress(), 
        items: this.cartService.items,
        totalAmount: this.totalAmount
      };

      this.apiService.post('orders', orderData).subscribe({
        next: () => {
          this.successMessage = 'Đơn hàng đã được xác nhận thành công!';
          this.router.navigate(['/order-success']);  // Điều hướng đến trang thành công
        },
        error: (error) => {
          console.error('Error confirming order:', error);
          this.errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại!';
        }
      });
    } else {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin trước khi xác nhận đơn hàng.';
    }
  }

  // Tạo địa chỉ đầy đủ khi xác nhận đơn hàng
  buildFullAddress(): string {
    const address = this.userInfoForm.value.address;
    const province = this.provinces.find(p => p.id === this.userInfoForm.value.province)?.name;
    const district = this.districts.find(d => d.id === this.userInfoForm.value.district)?.name;
    const ward = this.wards.find(w => w.id === this.userInfoForm.value.ward)?.name;

    return `${address}, ${ward ? ward + ', ' : ''}${district ? district + ', ' : ''}${province ? province : ''}`;
  }
  // Xử lý việc chọn file ảnh đại diện
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.userInfoForm.patchValue({ image: file });
      this.userInfoForm.get('image')?.updateValueAndValidity();
    }
  }
  
}

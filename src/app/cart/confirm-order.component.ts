import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Account } from '../account/account.model';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LocationService } from './location.service';

import { FormsModule } from '@angular/forms'; 
import { Token } from '@angular/compiler';


@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ConfirmOrderComponent implements OnInit {
  userInfoForm: FormGroup;
  selectedItems: any[] = [];
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
      addressDetail: ['', Validators.required],
      paymentMethod: ['', Validators.required]
      
    });
  }

  ngOnInit(): void {
  // Lấy dữ liệu từ localStorage
  const items = localStorage.getItem('selectedItems');
  if (items) {
    this.selectedItems = JSON.parse(items);
    console.log("selectItemcc: ", this.selectedItems)
  }
  
 
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/login']); // Nếu không có token, chuyển hướng tới trang đăng nhập
      return;
    }
  
    this.loadUserProfile();
    this.getTotalAmount();
    this.loadProvinces();
 // Tải danh sách tỉnh
 
 
}


loadProvinces() {
  this.locationService.getProvinces().subscribe(
    (data: any) => {
      console.log('Provinces from API:', data); // Kiểm tra dữ liệu
      this.provinces = data;
      
    },
    error => console.error('Error loading provinces:', error)
  );
}
onProvinceChange(event: Event): void {
  const provinceCode = (event.target as HTMLSelectElement).value;
  console.log('Province Code:', provinceCode); 
  if (provinceCode) {
    this.userInfoForm.patchValue({ province: provinceCode }); // Lưu tỉnh vào form
    this.locationService.getDistricts(provinceCode).subscribe(
      (data: any) => {
        this.districts = data.districts;
       
      },
      error => {
        console.error('Error loading districts:', error);
      }
    );
  }
  this.userInfoForm.patchValue({ district: '', ward: '' }); // Reset quận và xã
  this.wards = []; // Xóa danh sách xã/phường
}

onDistrictChange(event: Event): void {
  const districtCode = (event.target as HTMLSelectElement).value;
  console.log('District Code:', districtCode);
  if (districtCode) {
    this.userInfoForm.patchValue({ district: districtCode }); // Lưu quận vào form
    this.locationService.getWards(districtCode).subscribe(
      (data: any) => {
        this.wards = data.wards;
        
      },
      error => {
        console.error('Error loading wards:', error);
      }
    );
  }
  this.userInfoForm.patchValue({ ward: '' }); // Reset xã/phường
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
  getTotalAmount(): number {
    return this.selectedItems.reduce((total, item) => total + item.qty * item.price, 0);
    
  }

  confirmOrder(): void {
    console.log('Form Value:', this.userInfoForm.value);
    if (this.userInfoForm.valid) {
      // Cập nhật tổng tiền
      this.totalAmount = this.getTotalAmount();
      const paymentMethod = this.userInfoForm.value.paymentMethod;
        // Chuyển đổi `items` thành `detailedInvoices`
        
       
        const detailedInvoices = this.selectedItems.map((item) => {
          return {
            product: { id: item.id, name: item.name, price: item.price }, 
            quantity: item.qty,
            paymentMethod: paymentMethod
          };
        });
      const orderData = {
        user: { id: this.userId },  
        address: this.buildFullAddress(),
        detailedInvoices: detailedInvoices,
        totalAmount: this.totalAmount,
        status: 'pending'  
      };
      console.log("OdderData: ", orderData)
  
      
      const token = sessionStorage.getItem('authToken');
      
      if (!token) {
        this.errorMessage = 'Bạn cần đăng nhập để xác nhận đơn hàng.';
        return;
      }
  
      // Gửi yêu cầu API để tạo đơn hàng với token trong header
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
  
  
  
  
  buildFullAddress(): string {
    const addressDetail = this.userInfoForm.value.addressDetail;
    const provinceCode = Number(this.userInfoForm.value.province);
    const districtCode = Number(this.userInfoForm.value.district);
    const wardCode = Number(this.userInfoForm.value.ward);
  
    const province = this.provinces.find(p => p.code === provinceCode)?.name;
    const district = this.districts.find(d => d.code === districtCode)?.name;
    const ward = this.wards.find(w => w.code === wardCode)?.name;
  
    let fullAddress = addressDetail ? addressDetail : '';
  
    if (ward) {
      fullAddress += `, ${ward}`;
    }
  
    if (district) {
      fullAddress += `, ${district}`;
    }
  
    if (province) {
      fullAddress += `, ${province}`;
    }
  
    return fullAddress;
  }
  
  
  
 
  
}

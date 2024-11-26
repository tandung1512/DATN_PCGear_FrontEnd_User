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
  newAddressForm!: FormGroup;
  selectedItems: any[] = [];
  userId: string | undefined;
  account: Account | undefined;
  errorMessage = '';
  successMessage = '';
  totalAmount: number = 0;
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  savedAddresses: any[] = [];
  selectedAddress: any;
  showAddressForm: boolean = false;

  

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
      selectedAddress: [''],
      
      province: ['', Validators.required],
      district: ['', Validators.required],
      ward: ['', Validators.required],
      addressDetail: ['', Validators.required],
      paymentMethod: ['', Validators.required]
      
    });
    this.newAddressForm = this.fb.group({
      province: ['', Validators.required],
      district: ['', Validators.required],
      ward: ['', Validators.required],
      detail: ['', Validators.required],
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
toggleAddressForm(): void {
  this.showAddressForm = !this.showAddressForm; // Ẩn/hiện form
}
cancelAddressForm(): void {
  this.showAddressForm = false; // Ẩn form khi nhấn hủy
  this.newAddressForm.reset(); // Reset lại form
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
      
      // Lấy danh sách địa chỉ từ tài khoản
      if (this.account.addresses && this.account.addresses.length > 0) {
        this.savedAddresses = this.account.addresses;
        const defaultAddress = this.account.addresses.find(addr => addr.isDefault);
        
        // Nếu có địa chỉ mặc định, tự động điền
        if (defaultAddress) {
          this.fillAddressToForm(defaultAddress);
        }
      }

      this.userInfoForm.patchValue({
        name: this.account.name,
        phone: this.account.phone,
        email: this.account.email,
      });
    },
    error: (error) => {
      console.error('Error loading user profile:', error);
      this.errorMessage = 'Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.';
    }
  });
}


addNewAddress(): void {
  if (this.newAddressForm.valid) {
    const newAddress = this.newAddressForm.value;
    const token = sessionStorage.getItem('authToken');  // Lấy token từ sessionStorage

    console.log('Token:', token);
    const provinceName = this.provinces.find(p => p.code === Number(newAddress.province))?.name;
const districtName = this.districts.find(d => d.code === Number(newAddress.district))?.name;
const wardName = this.wards.find(w => w.code === Number(newAddress.ward))?.name;

    // Kiểm tra nếu thông tin địa chỉ bị thiếu
    if (!provinceName || !districtName || !wardName) {
      this.errorMessage = 'Vui lòng chọn đầy đủ thông tin tỉnh, huyện, xã.';
      return;
    }
      // Cập nhật lại dữ liệu trước khi gửi
      newAddress.province = provinceName;
      newAddress.district = districtName;
      newAddress.ward = wardName;  

    // Gửi yêu cầu POST kèm token trong header
    this.apiService.post(`accounts/${this.userId}/addresses`, newAddress).subscribe({
      next: () => {
        this.successMessage = 'Địa chỉ mới đã được thêm!';
        this.savedAddresses.push({ ...newAddress, id: this.savedAddresses.length + 1 });
        this.showAddressForm = false;
      },
      error: (error) => {
        console.error('Error adding new address:', error);
        this.errorMessage = 'Không thể thêm địa chỉ. Vui lòng thử lại!';
      }
    });
  } else {
    this.errorMessage = 'Vui lòng nhập đầy đủ thông tin địa chỉ!';
  }
}




onAddressChange(event: Event): void {
  const selectedId = (event.target as HTMLSelectElement).value; // Lấy giá trị của ID địa chỉ đã chọn
  const selectedAddress = this.savedAddresses.find(addr => addr.id === Number(selectedId)); // Tìm địa chỉ tương ứng

  if (selectedAddress) {
    this.fillAddressToForm(selectedAddress); // Gọi hàm để điền thông tin vào form
  }
}

fillAddressToForm(address: any): void {
  console.log('Filling address to form:', address);
  this.userInfoForm.patchValue({
    addressDetail: address.detail,  
    ward: address.ward,
    district: address.district,  
    province: address.province  
  });
}


  getTotalAmount(): number {
    return this.selectedItems.reduce((total, item) => total + item.qty * item.price, 0);
    
  }

  confirmOrder(): void {
    
    if (this.userInfoForm.valid) {
      const selectedAddressId = this.userInfoForm.value.selectedAddress;
      const selectedAddress = this.savedAddresses.find(addr => addr.id === Number(selectedAddressId));
  
      const address = selectedAddress
        ? `${selectedAddress.detail}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province}`
        : this.buildFullAddress();
  
      const orderData = {
        user: { id: this.userId },
        address: address,
        detailedInvoices: this.selectedItems.map(item => ({
          product: { id: item.id, name: item.name, price: item.price },
          quantity: item.qty,
          paymentMethod: this.userInfoForm.value.paymentMethod,
        })),
        
        totalAmount: this.getTotalAmount(),
       
        status: 'pending'
      };
  
      console.log('Order Data:', orderData);
      this.apiService.post('orders', orderData).subscribe({
        next: () => {
          this.cartService.clearSelectedItems(this.selectedItems);

          this.successMessage = 'Đơn hàng đã được xác nhận thành công!';
          this.router.navigate(['/order-success']);
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

  
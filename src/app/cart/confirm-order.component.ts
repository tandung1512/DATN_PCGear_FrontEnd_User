import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Account } from '../account/account.model';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ghnService } from './ghn.service';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../main/product/product.service';
// Định nghĩa interface District
interface District {
  DistrictID: number;
  DistrictName: string;
  WardCode: number;
  WardName: string;
}




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
  userId: string | null = null;
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
  shippingFee: number | null = null;
  services: any[] = [];
  selectedServiceId: number | null = null;
  
  
  




  

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private cartService: CartService,  // Dịch vụ giỏ hàng
    private router: Router,
    private authService: AuthService,
    private ghnService: ghnService,
    private productService: ProductService
  ) {
    this.userInfoForm = this.fb.group({
      
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
      email: ['', [Validators.required, Validators.email]],
      selectedAddress: [''],
      paymentMethod: ['', Validators.required],
      weight: [1000, Validators.required],
      districtId: ['', Validators.required],
      service: ['', Validators.required],
      wardCode: ['', Validators.required],
      
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
  this.userId = this.authService.getUserId();
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
    
    
 
 
 
}
toggleAddressForm(): void {
  this.showAddressForm = !this.showAddressForm; // Ẩn/hiện form
}
cancelAddressForm(): void {
  this.showAddressForm = false; // Ẩn form khi nhấn hủy
  this.newAddressForm.reset(); // Reset lại form
}

loadProvinces() {
  this.ghnService.getProvinces().subscribe(
    (response: any) => {
      console.log('Provinces from API:', response);
      // Trích xuất mảng provinces từ data
      this.provinces = response.data;  // Gán data cho provinces
    },
    error => {
      console.error('Error loading provinces:', error);
    }
  );
  
}
onProvinceChange(event: Event): void {
  const provinceId = (event.target as HTMLSelectElement).value;  
  
  if (provinceId) {
    this.userInfoForm.patchValue({ province: provinceId });  
    this.ghnService.getDistricts(Number(provinceId)).subscribe(
      (response: any) => {
        console.log('Districts from API:', response);
        this.districts = response.data;  
      },
      error => {
        console.error('Error loading districts:', error);
      }
    );
  } else {
    console.error('Invalid Province ID:', provinceId);
  }
  this.userInfoForm.patchValue({ district: '', ward: '' });
  this.districts = [];
  this.wards = [];
}




onDistrictChange(event: Event): void {
  const districtId = (event.target as HTMLSelectElement).value;  // Đang lấy value từ dropdown
  console.log('Selected District ID:', districtId); // Kiểm tra districtId

  if (districtId) {
    this.userInfoForm.patchValue({ district: districtId });

    this.ghnService.getWards(Number(districtId)).subscribe(
      (response: any) => {
        console.log('Wards from API:', response); // Kiểm tra dữ liệu wards trả về
        this.wards = response.data;  // Gán data cho danh sách wards
      },
      error => console.error('Error loading wards:', error)
    );
  }

  
  this.userInfoForm.patchValue({ ward: '' });
  this.wards = [];
}


loadUserProfile(): void {
 

  this.apiService.get<Account>(`accounts/profile/${this.userId}`).subscribe({
    next: (response: Account) => {
      this.account = response;
      this.userId = response.id;

      if (this.account.addresses && this.account.addresses.length > 0) {
        this.savedAddresses = this.account.addresses;

        const defaultAddress = this.account.addresses.find((addr) => addr.isDefault);
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

    // Lấy tên tỉnh, huyện, xã dựa trên ID
    const provinceName = this.provinces.find(p => p.ProvinceID === Number(newAddress.province))?.ProvinceName;
    const districtName = this.districts.find(d => d.DistrictID === Number(newAddress.district))?.DistrictName;
    const wardName = this.wards.find(w => w.WardCode === newAddress.ward)?.WardName;
    console.log('Selected Address:', {
      province: provinceName,
      district: districtName,
      ward: wardName,
      detail: newAddress.detail
    });
    
    // Kiểm tra nếu thông tin địa chỉ bị thiếu
    if (!provinceName || !districtName || !wardName) {
      this.errorMessage = 'Vui lòng chọn đầy đủ thông tin tỉnh, huyện, xã.';
      return;
    }

    // Cập nhật lại dữ liệu trước khi gửi
    const completeAddress = {
      ...newAddress,
      province: provinceName,
      district: districtName,
      ward: wardName
    };

    // Gửi yêu cầu POST kèm token trong header
    this.apiService.post(`accounts/${this.userId}/addresses`, completeAddress).subscribe({
      next: (response: any) => {
        const newAddressId = response.id; 
        this.successMessage = 'Địa chỉ mới đã được thêm!';
        this.savedAddresses.push({ ...completeAddress, id: newAddressId });
        this.showAddressForm = false;
        this.newAddressForm.reset(); // Reset form sau khi thêm địa chỉ
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
    
    // Gọi API GHN để lấy danh sách các district
    this.ghnService.getDistricts(Number(selectedAddress.province)).subscribe(
      (response: any) => {
       
        const district = response.data.find((d: District) => d.DistrictName === selectedAddress.district);
        
        if (district) {
          const districtId = district.DistrictID;  
          selectedAddress.districtId = districtId;  // Thêm trường districtId vào address
          console.log('districtId',districtId);
            // Gọi API để lấy danh sách các wards (phường xã) trong district
            this.ghnService.getWards(districtId).subscribe(
              (Response: any) => {
                // Tìm wardCode tương ứng với wardName
                const ward = Response.data.find((w: District) => w.WardName === selectedAddress.ward);
  
                if (ward) {
                  const wardCode = ward.WardCode;  // Lấy wardCode từ API
                  selectedAddress.wardCode = wardCode;  // Thêm wardCode vào address
                  console.log('wardCode', wardCode);
                  this.selectedAddress = selectedAddress;
                  
                  this.fillAddressToForm(selectedAddress);
                  this.loadAvailableServices();
                } else {
                  console.error('Không tìm thấy wardCode cho wardName:', selectedAddress.ward);
                }
              },
              error => {
                console.error('Error loading wards:', error);
              }
            );
  
          
        
        } else {
          console.error('Không tìm thấy districtId cho districtName:', selectedAddress.district);
        }
      },
      error => {
        console.error('Error loading districts:', error);
      }
    );
  }
   // Reset selected service khi thay đổi địa chỉ
   this.selectedServiceId = null;  // Reset dịch vụ
   this.userInfoForm.patchValue({ service: '' });
}

fillAddressToForm(address: any): void {
  this.userInfoForm.patchValue({
    addressDetail: address.detail,
    ward: address.ward,
    district: address.district,
    province: address.province,
    districtId: address.districtId,
    wardCode: address.wardCode,
    
  });

  
 
}




  getTotalAmount(): number {
    return this.selectedItems.reduce((total, item) => total + item.qty * item.price, 0);
    
  }
  calculateTotalAmount() {
    const totalProductPrice = this.getTotalAmount();
    if (this.shippingFee !== null) {
      this.totalAmount = totalProductPrice + this.shippingFee;  // Cộng phí giao hàng vào tổng tiền
    } else {
      this.totalAmount = totalProductPrice;  // Nếu chưa có phí giao hàng, chỉ tính tổng tiền sản phẩm
    }}

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
          this.onPurchase();
          this.successMessage = 'Đơn hàng đã được xác nhận thành công!';
          this.router.navigate(['/order-success']);
        },
        error: (error) => {
          console.error('Error confirming order:', error);
          this.errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại!';
        }
      });
      this.createOrder();
      
    } else {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin trước khi xác nhận đơn hàng.';
    }
    
  }
  
  
  
  buildFullAddress(): string {
    const selectedAddress = this.selectedAddress; 
  
    if (!selectedAddress) {
      console.error('Selected address is undefined or null');
      return '';  
    }
  
    console.log('hahahahahahah:', selectedAddress);
  
    // Kết hợp các phần địa chỉ thành một chuỗi
    return `${selectedAddress.detail}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province}`;
  }
  loadAvailableServices(): void {
    // Kiểm tra địa chỉ đã chọn có đầy đủ thông tin không
    if (!this.selectedAddress || !this.selectedAddress.districtId) {
      this.errorMessage = 'Địa chỉ chưa đầy đủ thông tin để tải dịch vụ vận chuyển.';
      return;
    }
  
    // Tạo dịch vụ cố định
    this.services = [{ service_id: 53321, short_name: 'Giao thường' }];
    this.successMessage = 'Đã tải dịch vụ vận chuyển cố định: Giao thường.';
  }
  

  // loadAvailableServices(): void {
  //   if (!this.selectedAddress || !this.selectedAddress.districtId) {
  //     this.errorMessage = 'Địa chỉ chưa đầy đủ thông tin để tải dịch vụ vận chuyển.';
  //     return;
  //   }
  
  //   const shopId = 195442; // Mã shop cố định hoặc được lấy từ cấu hình
  //   const fromDistrictId = 1442; // Mã quận xuất phát (cố định hoặc cấu hình)
  //   const toDistrictId = this.selectedAddress.districtId; // Lấy từ địa chỉ đã chọn
  
  //   const requestPayload = {
  //     shop_id: shopId,
  //     from_district: fromDistrictId,
  //     to_district: toDistrictId
  //   };
  
  //   console.log('Loading available services with payload:', requestPayload);
  
  //   // Gọi hàm getAvailableServices từ service với payload
  //   this.ghnService.getAvailableServices(requestPayload).subscribe({
  //     next: (response: any) => {
  //       console.log('Available services from GHN:', response);
  
  //       // Kiểm tra dữ liệu trả về từ GHN
  //       if (response && response.code === 200 && Array.isArray(response.data) && response.data.length > 0) {
  //         this.services = response.data;
  //         this.successMessage = 'Dịch vụ vận chuyển đã được tải thành công.';
  //       } else {
  //         this.services = [{ service_id: 53321, short_name: 'Giao thường' }];
  //         this.successMessage = 'Không có dịch vụ đặc biệt, sử dụng dịch vụ giao thường.';
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error loading available services:', error);
  //       this.services = [{ service_id: 53321, short_name: 'Giao thường' }];
  //       this.errorMessage = 'Không thể tải danh sách dịch vụ vận chuyển. Vui lòng thử lại.';
  //     }
  //   });
  // }
  
  
  
  


  onServiceChange(event: Event): void {
    const selectedServiceId = Number((event.target as HTMLSelectElement).value); 
    this.selectedServiceId = selectedServiceId;
    console.log('Dịch vụ được chọn:', selectedServiceId);
  
    if (selectedServiceId) {
      this.userInfoForm.patchValue({ service: selectedServiceId });
    }
  
  
    this.calculateShippingFee();
  }
  
  
  
  
  calculateShippingFee(): void {
    
  
    const formData = this.userInfoForm.value;
    console.log('formdata:',formData)
  
    // Xây dựng data gửi đến GHN API
    const data = {
      service_id: this.selectedServiceId, 
      insurance_value: this.getTotalAmount(), // Giá trị bảo hiểm là tổng tiền hàng
      from_district_id: 1442, // ID quận/huyện xuất phát (có thể lấy từ backend hoặc cố định)
      to_district_id: Number(formData.districtId), // ID quận/huyện đích (lấy từ form)
      to_ward_code: formData.wardCode, // Mã xã/phường đích (lấy từ form)
      weight: 1000, // Trọng lượng của đơn hàng (lấy từ form)
      length: 50,  // Chiều dài (cm)
      width:50,   // Chiều rộng (cm)
      height: 50   // Chiều cao (cm)
    };
    console.log('data',data)
  
    this.ghnService.calculateShippingFee(data).subscribe({
      next: (response) => {
        if (response && response.data && response.data.total) {
          this.shippingFee = response.data.total;
          this.calculateTotalAmount();
          
        } else {
          this.errorMessage = 'Không thể tính phí vận chuyển. Vui lòng thử lại.';
        }
        console.log('',this.shippingFee);
      },
      error: (error) => {
        console.error('Error calculating shipping fee:', error);
        this.errorMessage = 'Không thể tính phí vận chuyển. Vui lòng thử lại!';
      }
    });
  }
  
  

  createOrder(): void {
    if (!this.userInfoForm.valid || this.shippingFee === null) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin và tính phí vận chuyển trước khi tạo đơn hàng.';
      return;
    }
    const items = localStorage.getItem('selectedItems');
// Biến để lưu tên sản phẩm

if (items) {
  this.selectedItems = JSON.parse(items); // Parse dữ liệu từ JSON thành mảng đối tượng
  console.log("selectedItems: ", this.selectedItems);

  
  
}
  
    const formData = this.userInfoForm.value;
    const selectedAddress = this.buildFullAddress();
    
  
    const orderData = {
      
      
      to_name: formData.name,
      to_phone: formData.phone,
      to_address: selectedAddress,
      to_district_id: Number(formData.districtId), 
      to_ward_code: formData.wardCode, 
      cod_amount: this.getTotalAmount(), 
      weight: formData.weight,
      length: 50, 
      width: 50,  
      height: 50, 
      service_id: this.selectedServiceId, 
      payment_type_id: 2,
      required_note: 'KHONGCHOXEMHANG',
      items: this.selectedItems.map(item => ({
        name: item.name,
        code: item.code,
        quantity: item.qty,
        price: item.price,
        length: 5,
        width: 1,
        weight: 3,
        height: 3,
        category: {
          
        }
      }))
    };
  console.log('vaio------',orderData)
    this.ghnService.createOrder(orderData).subscribe({
      next: (response) => {
        console.log('Order created:', response);
        this.successMessage = 'Đơn hàng đã được tạo thành công!';
        
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.errorMessage = 'Không thể tạo đơn hàng. Vui lòng thử lại!';
      }
    });
  }
  
  onPurchase(): void {
    this.selectedItems.forEach(item => {
      const productId = item.id; 
      const quantity = item.qty; 
  
      this.productService.updateProductQuantity(productId, quantity).subscribe({
        next: () => {
          console.log(`Updated quantity for product ID: ${productId}`);
        },
        error: (err) => {
          console.error(`Failed to update quantity for product ID: ${productId}`, err);
        },
      });
    });
  }
  
  
 
  
}

  
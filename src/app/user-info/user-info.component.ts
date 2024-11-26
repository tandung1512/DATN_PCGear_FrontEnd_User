import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Account } from '../account/account.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class UserInfoComponent implements OnInit {
  userInfoForm: FormGroup;
  userId: string | null = null; // Kiểu dữ liệu string hoặc null
  errorMessage = '';
  successMessage = '';
  account: Account | undefined;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService
  ) {
    this.userInfoForm = this.fb.group({
      id: [{ value: '', disabled: true }, Validators.required],  // id vẫn disabled
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
      email: ['', [Validators.required, Validators.email]],
      
      image: [null]
    });
  }

  ngOnInit() {
    this.userId = this.authService.getUserId(); // Lấy userId từ AuthService
    console.log(this.userId); // Kiểm tra giá trị userId
    if (!this.userId) {
      console.error('User ID is undefined or null');
      this.errorMessage = 'Không có ID người dùng. Vui lòng đăng nhập lại.';
      return;
    }
    this.loadUserProfile();
  }
  

  loadUserProfile() {
    if (this.userId) {
      console.log(`Loading user profile for ID: ${this.userId}`);
      this.apiService.get<Account>(`accounts/profile/${this.userId}`).subscribe({
        next: (response: Account) => {
          console.log('User profile loaded successfully:', response);
          this.account = response;
          if (this.account) {
            this.userInfoForm.patchValue(this.account);  // Load dữ liệu vào form
          }
        },
        error: (error) => {
          console.error('Error loading user profile:', error);
          this.errorMessage = error.error?.message || 'Không thể tải thông tin người dùng.';
        }
      });
    }
  }
  

  // Hàm xử lý khi người dùng chọn file ảnh
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.userInfoForm.patchValue({ image: file });
      this.userInfoForm.get('image')?.updateValueAndValidity();
    }
  }

 // Hiển thị dữ liệu khi người dùng submit form
 updateProfile() {
  if (this.userInfoForm.valid) {
    const formData = new FormData();

    // Log dữ liệu nhập vào khi submit
    console.log('Dữ liệu form trước khi gửi:', this.userInfoForm.value);

    // Append form values
    Object.keys(this.userInfoForm.controls).forEach(key => {
      const value = this.userInfoForm.get(key)?.value;
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    // Gửi PUT request
    this.apiService.put(`accounts/${this.userId}`, formData).subscribe({
      next: () => {
        this.successMessage = 'Chỉnh sửa thông tin người dùng thành công!';
        setTimeout(() => {
          this.router.navigate(['/']);  // Điều hướng về trang chủ sau 2 giây
        }, 2000);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.errorMessage = error.error?.message || 'Cập nhật thất bại. Hãy thử lại sau!';
      }
    });
  } else {
    this.errorMessage = 'Vui lòng nhập đầy đủ thông tin.';
  }
}
}

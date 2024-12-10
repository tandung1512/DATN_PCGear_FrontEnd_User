import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Account } from '../account/account.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class UserInfoComponent implements OnInit {
  userInfoForm: FormGroup;
  userId: string | null = null;
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
      id: [{ value: '', disabled: true }, Validators.required], // ID bị khóa
      name: ['', Validators.required],
      password: ['', [Validators.minLength(6)]], // Không bắt buộc, nhưng phải >= 6 ký tự nếu nhập
      phone: ['', [Validators.pattern('^[0-9]{10,11}$')]], // Không bắt buộc, nhưng phải đúng định dạng
      email: ['', [Validators.email]], // Không bắt buộc, nhưng phải đúng định dạng
      image: [null], // File ảnh
    });
  }

  ngOnInit() {
    this.userId = this.authService.getUserId();
    if (!this.userId) {
      this.errorMessage = 'Không xác định được ID người dùng. Vui lòng đăng nhập lại.';
      return;
    }
    this.loadUserProfile();
  }

  loadUserProfile() {
    if (!this.userId) return;

    this.apiService.get<Account>(`accounts/profile/${this.userId}`).subscribe({
      next: (response) => {
        this.account = response;
        if (this.account) {
          this.userInfoForm.patchValue(this.account); // Load dữ liệu vào form
        }
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Không thể tải thông tin người dùng. Hãy thử lại sau!';
        console.error('Error loading user profile:', error); // Log chi tiết lỗi
      },
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.userInfoForm.patchValue({ image: file });
      this.userInfoForm.get('image')?.updateValueAndValidity();
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error); // Log lỗi ra để kiểm tra
    if (error.status === 0) {
      return throwError(() => new Error('Không thể kết nối với máy chủ.'));
    }
    // Kiểm tra phản hồi lỗi từ server
    const errorMessage = error.error?.message || error.statusText || 'Đã có lỗi xảy ra!';
    console.log('Full error response:', error); // Log phản hồi đầy đủ
    return throwError(() => new Error(errorMessage));
  }

  updateProfile(): void {
    if (this.userInfoForm.invalid) {
      this.errorMessage = 'Vui lòng kiểm tra lại thông tin và thử lại.';
      return;
    }
  
    console.log('Submitting data:', this.userInfoForm.value); // Log dữ liệu gửi đi
  
    this.apiService.put(`accounts/profile/${this.userId}`, this.userInfoForm.value).subscribe({
      next: (response) => {
        console.log('API Response:', response); // Log phản hồi API
        this.successMessage = 'Cập nhật thông tin thành công!';
      },
      error: (err) => {
        this.errorMessage = 'Lỗi khi cập nhật hồ sơ: ' + err.message;
        console.error('Error updating profile:', err); // Log chi tiết lỗi
      },
    });
  }
  
  
}

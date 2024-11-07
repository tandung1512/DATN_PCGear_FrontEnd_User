import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Account } from '../account/account.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class UserInfoComponent implements OnInit {
  userInfoForm: FormGroup;
  userId: string | undefined;
  errorMessage = '';
  successMessage = '';
  account: Account | undefined;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.userInfoForm = this.fb.group({
      id: [{ value: '', disabled: true }, Validators.required],
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      image: [null]
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.apiService.get<Account>('accounts/profile').subscribe({
      next: (response: Account) => {
        this.account = response;
        this.userId = response.id;
        this.userInfoForm.patchValue(this.account);
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.errorMessage = error.error?.message || 'Could not load user profile. Please try again later.';
      }
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.userInfoForm.patchValue({ image: file });
      this.userInfoForm.get('image')?.updateValueAndValidity();
    }
  }

  updateProfile() {
    if (this.userInfoForm.valid) {
      const formData = new FormData();
      
      // Append form values, skipping null or undefined fields
      Object.keys(this.userInfoForm.controls).forEach(key => {
        const value = this.userInfoForm.get(key)?.value;
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      this.apiService.put(`accounts/${this.userId}`, formData).subscribe({
        next: () => {
          this.successMessage = 'Profile updated successfully!';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.errorMessage = error.error?.message || 'Profile update failed. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'Please fill out all required fields correctly.';
    }
  }
}

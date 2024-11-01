import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './register.component.html',
  
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    // Initialize the form group with validation rules
    this.registerForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      image: [null]  // Optional image upload
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.registerForm.patchValue({ image: file });
      this.registerForm.get('image')?.updateValueAndValidity();
    }
  }

  register() {
    if (this.registerForm.valid) {
      const formData = new FormData();
      formData.append('id', this.registerForm.get('id')?.value);
      formData.append('name', this.registerForm.get('name')?.value);
      formData.append('password', this.registerForm.get('password')?.value);
      formData.append('phone', this.registerForm.get('phone')?.value);
      formData.append('email', this.registerForm.get('email')?.value);
      formData.append('address', this.registerForm.get('address')?.value);
      
      const image = this.registerForm.get('image')?.value;
      if (image) {
        formData.append('image', image);
      }

      // Send the form data to the API service
      this.apiService.post('accounts/register', formData).subscribe({
        next: (response) => {
          console.log(response);
          alert('Registration successful!');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
          console.error('Registration error:', error);
        }
      });
    } else {
      this.errorMessage = 'Please fill out all required fields correctly.';
    }
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, // Needed for reactive forms
    CommonModule,         // Needed for *ngIf and other common directives
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize the form group
    this.loginForm = this.fb.group({
      id: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      const { id, password } = this.loginForm.value;
      
      this.authService.login(id, password).subscribe({
        next: () => {
          
        },
        error: (error) => {
          if (error.status === 401) {
            this.errorMessage = 'Sai ID hoặc mật khẩu';
          } else {
            this.errorMessage = 'Có lỗi xảy ra, vui lòng thử lại!';
          }
          console.error('Login error:', error);
        }
      });
    } else {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin!';
    }
  }
  
  
}

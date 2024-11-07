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
    CommonModule         // Needed for *ngIf and other common directives
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
        next: (token) => {
          console.log('Login successful, token:', token);
          this.router.navigate(['/']).then(() => {
            
            location.reload(); // Reload the homepage after navigation
          });
        },
        error: (error) => {
          this.errorMessage = 'Invalid ID or password';
          console.error('Login error:', error);
        }
      });
    } else {
      this.errorMessage = 'Please fill out all required fields';
    }
  }
}

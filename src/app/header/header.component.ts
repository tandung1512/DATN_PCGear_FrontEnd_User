import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  userName = ''; // To store the logged-in user's name
  isAdmin = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  // Check login status and update user information
  checkLoginStatus(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.isLoggedIn = true;
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      this.userName = userData.name || 'User';
      this.isAdmin = userData.role === 'admin';
    } else {
      this.isLoggedIn = false;
    }
  }

  // Navigate to Login page
  login(): void {
    this.router.navigate(['/login']);
  }

  // Navigate to Register page
  register(): void {
    this.router.navigate(['/register']);
  }

  // Navigate to User Information Update page
  updateUserInfo(): void {
    this.router.navigate(['/user-info']);
  }

  // Navigate to Admin Dashboard if user is an admin
  goToAdminDashboard(): void {
    if (this.isAdmin) {
      this.router.navigate(['/admin-dashboard']);
    }
  }

  // Logout and clear session
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
}

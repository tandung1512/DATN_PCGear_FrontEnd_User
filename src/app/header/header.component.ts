import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Account } from '../account/account.model';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [CommonModule],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  userName: string = ''; 
  isAdmin: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.checkLoginStatus(); // Check login status on component load
  }

  // Check login status and update user details
  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const userData: Account | null = this.authService.getUserData();
      console.log("User Data:", userData); // Log entire user data
      if (userData) {
        this.userName = userData.name || 'User';
        console.log("User Name:", this.userName); // Log name or fallback value
        this.isAdmin = userData.admin;
      }
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

  // Navigate to User Info Update page
  updateUserInfo(): void {
    this.router.navigate(['/user-info']);
  }

  // Navigate to Admin Dashboard if user is an admin
  goToAdminDashboard(): void {
    if (this.isAdmin) {
      this.router.navigate(['/admin-dashboard']);
    }
  }

  // Logout and clear session data
  logout(): void {
    this.authService.logout(); // Clear session with AuthService
    this.isLoggedIn = false;
    this.userName = ''; // Clear user name after logout
    this.isAdmin = false; // Clear admin status after logout
    this.router.navigate(['/']); // Redirect to homepage
  }
}

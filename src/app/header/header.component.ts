import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  
  // Method triggered on Login button click
  login() {
    // Implement login functionality or navigation here
    alert('Navigate to Login Page');
  }

  // Method triggered on Register button click
  register() {
    // Implement register functionality or navigation here
    alert('Navigate to Register Page');
  }
}

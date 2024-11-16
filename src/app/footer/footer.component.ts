import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(private router: Router) {}

  navigateToAbout() {
    this.router.navigate(['/about']);  // Điều hướng đến trang Giới thiệu
  }
  
  navigateToPay() {
    this.router.navigate(['/pay']);  // Điều hướng đến trang Liên Hệ
  }
  navigateToGuide() {
    this.router.navigate(['/guide']);  // Điều hướng đến trang Hướng dẫn mua hàng online
  }
  navigateToOrder() {
    this.router.navigate(['/guide']);  // Điều hướng đến trang Hướng dẫn mua hàng online
  }

}

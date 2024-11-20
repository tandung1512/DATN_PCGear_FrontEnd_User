import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  standalone: true, 
  imports: [CommonModule] 
 
})
export class OrderSuccessComponent implements OnInit {

  successMessage: string = 'Đơn hàng của bạn đã được xác nhận thành công!';
  orderId: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Nếu có ID đơn hàng, hiển thị
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'] || null;
    });
  }

  goToHomePage(): void {
    // Điều hướng về trang chủ khi nhấn nút "Về trang chủ"
    this.router.navigate(['/']);
  }
}

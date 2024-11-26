import { Component, OnInit } from '@angular/core';
import { ProductComponent } from './product/product.component';
import { CategoryComponent } from "./category/category.component";
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; 



@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ProductComponent, CategoryComponent, CommonModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  banners: { img: string, active: boolean }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
  const queryParams = new URLSearchParams(window.location.search);
  const bannersFromQuery: { img: string; active: boolean }[] = [];
  let index = 1;

  while (queryParams.has(`img${index}`)) {
    const img = queryParams.get(`img${index}`);
    if (img) {
      bannersFromQuery.push({ img, active: true });
    }
    index++;
  }

  if (bannersFromQuery.length === 0) {
    // Thử lấy từ LocalStorage nếu không có query params
    const storedBanners = localStorage.getItem('banners');
    if (storedBanners) {
      this.banners = JSON.parse(storedBanners);
    }
  } else {
    this.banners = bannersFromQuery;
    localStorage.setItem('banners', JSON.stringify(bannersFromQuery));
  }
    
    console.log('Banners hiển thị trên trang chủ:', this.banners);
  }
}


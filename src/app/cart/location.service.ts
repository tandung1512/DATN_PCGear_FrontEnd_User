// location.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private BASE_URL = 'https://provinces.open-api.vn/api';

  constructor(private http: HttpClient) {}

  // Lấy danh sách tỉnh/thành phố
  getProvinces(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/p/`);
  }

  // Lấy danh sách quận/huyện dựa trên ID tỉnh
  getDistricts(provinceId: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/p/${provinceId}?depth=2`);
  }

  // Lấy danh sách phường/xã dựa trên ID quận
  getWards(districtId: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/d/${districtId}?depth=2`);
  }
}

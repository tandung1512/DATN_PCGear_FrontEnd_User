import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ghnService {
  private apiUrl = 'http://localhost:8080/api/ghn';

  constructor(private http: HttpClient) {}

  getProvinces(): Observable<any> {
    return this.http.get(`${this.apiUrl}/provinces`);
  }

  getDistricts(provinceId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/districts`, { province_id: provinceId });
  }

  getWards(districtId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/wards?district_id=${districtId}`);
  }

  calculateShippingFee(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/calculate-fee`, data);
  }

  createOrder(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-order`, data);
  }
  getAvailableServices(payload: { shop_id: number; from_district: number; to_district: number }): Observable<any> {
    const url = `${this.apiUrl}/available-services?shop_id=${payload.shop_id}&from_district=${payload.from_district}&to_district=${payload.to_district}`;
    console.log('Request URL:', url);
    return this.http.get<any>(url);
}

  
  
}

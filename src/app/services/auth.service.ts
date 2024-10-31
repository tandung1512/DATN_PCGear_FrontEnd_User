import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apiService: ApiService) {}

  // Login method
  login(id: string, password: string): Observable<string> {
    const body = { id, password };
    return this.apiService.post<{ token: string }>('auth/login', body).pipe(
      map(response => {
        localStorage.setItem('authToken', response.token); // Store token in localStorage
        return response.token;
      })
    );
  }

  // Logout method to clear token
  logout(): void {
    localStorage.removeItem('authToken');
  }

  // Retrieve token from localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

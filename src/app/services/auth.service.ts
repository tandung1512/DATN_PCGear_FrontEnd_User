import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apiService: ApiService, private router: Router) {}

  // Login method to authenticate the user and store token and user data
  login(id: string, password: string): Observable<string> {
    const body = { id, password };
    return this.apiService.post<{ token: string; user: { name: string; role: string } }>('auth/login', body).pipe(
      tap(response => {
        // Store token and user data in localStorage
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));
      }),
      map(response => response.token)
    );
  }

  // Logout method to clear token and user data
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    this.router.navigate(['/login']); // Redirect to login page
  }

  // Retrieve token from localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Get user data (name and role) from localStorage
  getUserData(): { name: string; role: string } | null {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  // Check if user is logged in based on the presence of a token
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Check if the logged-in user has admin privileges
  isAdmin(): boolean {
    const user = this.getUserData();
    return user?.role === 'admin';
  }
}

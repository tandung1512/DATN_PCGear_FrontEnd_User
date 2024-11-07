import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Account } from '../account/account.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apiService: ApiService, private router: Router) {}

  login(id: string, password: string): Observable<string> {
    const body = { id, password };
    return this.apiService.post<{ token: string; id: string; name: string; phone: string; email: string; address: string; admin: boolean }>('auth/login', body).pipe(
      tap(response => {
        console.log("API Response:", response); // Log entire response to inspect its structure
        localStorage.setItem('authToken', response.token);
  
        // Store user data directly, as API response is the user data itself
        localStorage.setItem('userData', JSON.stringify({
          id: response.id,
          name: response.name,
          phone: response.phone,
          email: response.email,
          address: response.address,
          admin: response.admin
        }));
  
        this.router.navigate(['/']);
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

  // Get user data (Account) from localStorage with error handling
  getUserData(): Account | null {
    const userData = localStorage.getItem('userData');
    
    // Check if userData exists and is not set to "undefined" or null
    if (!userData || userData === "undefined") {
      return null; // Return null if no valid user data is found
    }
  
    try {
      return JSON.parse(userData) as Account; // Parse and cast to Account
    } catch (error) {
      console.error("Error parsing user data from localStorage", error);
      localStorage.removeItem('userData'); // Clear invalid data from localStorage
      return null; // Return null on error
    }
  }

  // Retrieve the user ID from stored user data
  getUserId(): string | null {
    return this.getUserData()?.id || null; // Use optional chaining for simplicity
  }

  // Check if user is logged in based on the presence of a token
  isLoggedIn(): boolean {
    return this.getToken() !== null; // Returns true if token exists
  }

  // Check if the logged-in user has admin privileges
  // isAdmin(): boolean {
  //   return this.getUserData()?.admin === true; // Use optional chaining and check admin status
  // }
// Check if the logged-in user has admin privileges
isAdmin(): boolean {
  const userData = this.getUserData();
  if (userData && userData.admin !== undefined) {
    return userData.admin; // Return true if user is an admin
  }
  return false; // Return false if admin status is not available
}

  // Retrieve token from localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken'); // Return the token or null
  }
}

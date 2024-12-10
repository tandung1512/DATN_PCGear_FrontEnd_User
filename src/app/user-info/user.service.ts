import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Account } from '../account/account.model';
// Đảm bảo rằng bạn đã tạo model Account

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api'; 

  constructor(private http: HttpClient) {}

  // Lấy thông tin người dùng từ API
  getUserInfo(userId: string): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/accounts/profile/${userId}`);
  }

   // PUT method for updating profile
   put<T>(url: string, data: any): Observable<T> {
    return this.http.put<T>(url, data).pipe(catchError(this.handleError));
  }

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);  // Log error for debugging
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        errorMessage = 'No connection to the server';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Bad request';
      } else if (error.status === 500) {
        errorMessage = 'Internal Server Error';
      } else {
        errorMessage = `Server returned code ${error.status}, message is: ${error.statusText}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }

}

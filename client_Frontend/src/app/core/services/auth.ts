import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  token: string;
  customer?: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

private apiUrl = 'http://localhost:3000/api/customers';

  constructor(private http: HttpClient) {}

  // ====================
  // LOGIN
  // ====================
  login(data: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      data
    );
  }

  // ====================
  // REGISTER
  // ====================
  register(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/register`,
      data
    );
  }


  // ====================
  // SAVE LOGIN DATA
  // ====================
  saveLogin(res: LoginResponse): void {
    if (res.token) {
      localStorage.setItem('token', res.token);
    }

    if (res.customer) {
      localStorage.setItem('customer', JSON.stringify(res.customer));
    }
  }

  // ====================
  // GET CURRENT USER
  // ====================
  getCurrentUser(): any {
    const data = localStorage.getItem('customer');
    return data ? JSON.parse(data) : null;
  }

  // ====================
  // GET TOKEN
  // ====================
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ====================
  // CHECK LOGIN
  // ====================
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ====================
  // LOGOUT
  // ====================
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('customer');
  }
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CartService } from '../../core/services/cart';

export interface LoginResponse {
  token: string;
  customer?: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '/api/customers';
  // hoặc:
  // private apiUrl = '/api/auth';

  constructor(
    private http: HttpClient,
    private cartService: CartService
  ) {}

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
  saveLogin(res: any): void {

    // console.log('SAVE LOGIN:', res);
    //console.log('TOKEN:', res?.token);

    if (res.token) {
      localStorage.setItem('token', res.token);
    }

    if (res.customer) {
      localStorage.setItem(
        'customer',
        JSON.stringify(res.customer)
      );
    }

    // console.log(
    //   'TOKEN AFTER SAVE:',
    //   localStorage.getItem('token')
    // );
  }

  // ====================
  // GET CURRENT USER
  // ====================
  getCurrentUser(): any {
    const customer = localStorage.getItem('customer');
    return customer ? JSON.parse(customer) : null;
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
  // GET ROLE
  // ====================
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  // ====================
  // LOGOUT
  // ====================
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('customer');

    this.cartService.clearLocalCart();
  }
}
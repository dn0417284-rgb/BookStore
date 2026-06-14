import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';


import { CartService } from '../../core/services/cart';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/api/auth';

  constructor(
    private http: HttpClient,
    private cartService: CartService
  ) {}

  // ====================
  // LOGIN
  // ====================

  login(data: any): Observable<any> {

    return this.http.post(
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
  // SAVE USER
  // ====================

  saveLogin(res: any): void {

    if (res.token) {

      localStorage.setItem(
        'token',
        res.token
      );

    }

    if (res.customer) {

      localStorage.setItem(
        'customer',
        JSON.stringify(
          res.customer
        )
      );

    }

  }

  // ====================
  // GET USER
  // ====================

  getCurrentUser(): any {

    const customer =
      localStorage.getItem(
        'customer'
      );

    return customer
      ? JSON.parse(customer)
      : null;

  }

  // ====================
  // GET TOKEN
  // ====================

  getToken(): string | null {

    return localStorage.getItem(
      'token'
    );

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

    this.cartService.clearLocalCart();

  }

}
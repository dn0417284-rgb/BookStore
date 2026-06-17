import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartService } from '../../core/services/cart';
import { jwtDecode } from 'jwt-decode';

export interface LoginResponse {
  token: string;
  customer?: any;
}

interface JwtPayload {
  exp: number;
  role?: string;
  email?: string;
  id?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '/api/customers';

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
  saveLogin(res: LoginResponse): void {
    if (res.token) {
      localStorage.setItem('token', res.token);
    }

    if (res.customer) {
      const safeCustomer = {
        ...res.customer,
        role: res.customer.role ?? 'user',
      };

      localStorage.setItem('customer', JSON.stringify(safeCustomer));
    }
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
  // CHECK TOKEN VALID (QUAN TRỌNG)
  // ====================
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      const now = Date.now() / 1000; // seconds

      return decoded.exp > now;
    } catch (err) {
      return false;
    }
  }

  // ====================
  // CHECK LOGIN (FIXED)
  // ====================
  isLoggedIn(): boolean {
    return this.isTokenValid();
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
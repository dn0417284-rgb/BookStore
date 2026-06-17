import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = '/api/cart';

  private buyNowItem: CartItem | null = null;

  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ==========================
  // INIT LOAD CART
  // ==========================
  initCart(): void {

  const token = localStorage.getItem('token');

  if (token) {
    this.loadCart();
  }
}

  // ==========================
  // LOAD CART FROM SERVER
  // ==========================
  loadCart(): void {

    const token = localStorage.getItem('token');

    if (!token) {
      this.cartSubject.next([]);
      return;
    }

    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        this.cartSubject.next(res.data || []);
      },
      error: (err) => {
        console.error('LOAD CART ERROR:', err);
      }
    });
  }

  
  // ==========================
  // GET CART API
  // ==========================
  getCart(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // ==========================
  // ADD TO CART (REALTIME FIX)
  // ==========================
  addToCart(productId: number, quantity: number = 1): Observable<any> {
    return this.http.post(this.apiUrl, {
      product_id: productId,
      quantity
    }).pipe(
      tap((res: any) => {
        // ✅ backend trả cart mới -> update luôn UI
        this.cartSubject.next(res.data || []);
      })
    );
  }

  // ==========================
  // UPDATE QUANTITY
  // ==========================
  updateQuantity(productId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${productId}`, {
      quantity
    }).pipe(
      tap((res: any) => {
        this.cartSubject.next(res.data || []);
      })
    );
  }

  // ==========================
  // REMOVE ITEM
  // ==========================
  removeItem(productId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${productId}`).pipe(
    tap((res: any) => {

      console.log('SERVICE REMOVE', res);

      this.cartSubject.next(res.data || []);

    })
  );
}

  // ==========================
  // CLEAR CART
  // ==========================
  clearCart(): Observable<any> {
    return this.http.delete(this.apiUrl).pipe(
      tap(() => {
        this.cartSubject.next([]);
      })
    );
  }

  clearLocalCart(): void {
    this.cartSubject.next([]);
  }

  // ==========================
  // BUY NOW
  // ==========================
  setBuyNowItem(item: CartItem): void {
    this.buyNowItem = item;
  }

  getBuyNowItem(): CartItem | null {
    return this.buyNowItem;
  }

  clearBuyNowItem(): void {
    this.buyNowItem = null;
  }
}
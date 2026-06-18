import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private readonly API_URL = '/api/orders';

  constructor(private http: HttpClient) {}

  /**
   * =========================
   * CREATE ORDER (COD / MOMO)
   * =========================
   */
  createOrder(order: any): Observable<any> {
    return this.http.post(`${this.API_URL}`, order);
  }

  /**
   * =========================
   * REPAY ORDER (MÒM O LINK LẠI)
   * =========================
   */
  repayOrder(order_id: number): Observable<any> {
    return this.http.post(`${this.API_URL}/repay`, { order_id });
  }

  /**
   * =========================
   * GET ALL ORDERS (USER)
   * =========================
   */
  getOrders(): Observable<any> {
    return this.http.get(`${this.API_URL}`);
  }

  /**
   * =========================
   * GET ORDER DETAIL (USER)
   * =========================
   */
  getOrderDetail(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`);
  }

  /**
   * =========================
   * CANCEL ORDER
   * =========================
   */
  cancelOrder(id: number): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}/cancel`, {});
  }

  /**
   * =========================
   * ADMIN: GET ALL ORDERS
   * =========================
   */
  getAllOrdersAdmin(): Observable<any> {
    return this.http.get(`${this.API_URL}/admin/all`);
  }

  /**
   * =========================
   * ADMIN: UPDATE STATUS
   * =========================
   */
  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.API_URL}/admin/${id}/status`, {
      status
    });
  }

  /**
   * =========================
   * MOMO FLOW HELPER
   * (IMPORTANT: redirect browser)
   * =========================
   */
  payWithMoMo(order: any): void {
    this.createOrder(order).subscribe({
      next: (res: any) => {

        if (res?.paymentUrl) {
          // redirect sang MoMo
          window.location.href = res.paymentUrl;
        } else {
          //console.log('Order created (no MoMo):', res);
        }

      },
      error: (err) => {
        console.error('Create order error:', err);
      }
    });
  }

  /**
   * =========================
   * REPAY FLOW HELPER
   * =========================
   */
  repayAndPay(order_id: number): void {
    this.repayOrder(order_id).subscribe({
      next: (res: any) => {

        if (res?.paymentUrl) {
          window.location.href = res.paymentUrl;
        }

      },
      error: (err) => {
        console.error('Repay error:', err);
      }
    });
  }
}
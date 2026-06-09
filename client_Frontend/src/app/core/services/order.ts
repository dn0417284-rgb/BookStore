import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api/orders';
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  createOrder(orderData: any): Observable<any> {
    return this.http.post(this.apiUrl, orderData, {
      headers: this.getHeaders(),
    });
  }

  getMyOrders(): Observable<Order[]> {
    return this.http
      .get<any>(this.apiUrl, {
        headers: this.getHeaders(),
      })
      .pipe(map((res) => res.data || []));
  }

  getOrderDetail(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${orderId}`, {
      headers: this.getHeaders(),
    });
  }

  getAllOrders(): Observable<any> {
    return this.http.get<any>(`api/admin/oders`, {
      headers: this.getHeaders(),
    });
  }

  getOrderDetailAdmin(orderId: number): Observable<any> {
    return this.http.get<any>(`api/admin/${orderId}`, {
      headers: this.getHeaders(),
    });
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put(
      `api/admin/${orderId}/status`,
      {
        status,
      },
      {
        headers: this.getHeaders(),
      },
    );
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${orderId}/cancel`,
      {},
      {
        headers: this.getHeaders(),
      },
    );
  }

  /**
   * BỔ SUNG: API gửi yêu cầu lấy lại link thanh toán trực tuyến MoMo / ZaloPay cho đơn hàng cũ
   * Bảo mật tuyệt đối bằng cách tự động đính kèm mã Headers Token của tài khoản khách hàng
   */
  getRepayUrl(orderId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/repay`,
      {
        order_id: orderId,
      },
      {
        headers: this.getHeaders(),
      },
    );
  }
}

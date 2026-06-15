import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order.model';
@Injectable({
  providedIn: 'root',
})
export class AdminOderService {
  constructor(private http: HttpClient) {}
  getAllOders() {
    return this.http.get<Order[]>(`/api/orders/admin/all`);
  }
  getOrderById(id: number) {
    return this.http.get<any>(`/api/orders/admin/${id}`);
  }
  updateStatus(id: number, status: string) {
    return this.http.put(`/api/orders/admin/${id}/status`, { status });
  }
  getOrderLogs(id: number) {
    return this.http.get<any>(`/api/orders/admin/${id}/logs`);
  }
}

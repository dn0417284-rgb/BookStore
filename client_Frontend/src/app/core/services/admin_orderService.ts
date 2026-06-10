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
  deleteOrder(id: number) {
    return this.http.delete(`/api/orders/admin/${id}`);
  }
}

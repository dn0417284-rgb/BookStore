import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../models/customer.model';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}
  getCustomers() {
    return this.http.get<Customer[]>(`/api/customers`);
  }
  deleteCustomer(id: number) {
    return this.http.delete(`/api/customers/${id}`);
  }
  register(data: any): Observable<any> {
    return this.http.post(`/api/customers/register`, data);
  }
}

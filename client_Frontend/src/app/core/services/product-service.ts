import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  getProducts() {
    return this.http.get<Product[]>(`/api/products`);
  }
  createProduct(formData: FormData) {
    return this.http.post(`/api/products`, formData);
  }
  deleteProduct(id: number) {
    return this.http.delete(`/api/products/${id}`);
  }
  updateProduct(id: number, formData: FormData) {
    return this.http.put<Product>(`/api/products/${id}`, formData);
  }
}

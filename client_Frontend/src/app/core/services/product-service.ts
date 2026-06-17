import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  getProducts() {
    return this.http.get<Product[]>(`/api/products`);
  }
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`/api/products/${id}`);
  }

  searchProducts(keyword: string): Observable<Product[]> {
    return this.http.get<Product[]>(`api/products/search?keyword=${keyword}`);
  }

  getBestSellers(): Observable<Product[]> {
    return this.http.get<Product[]>(`api/products/best-sellers`);
  }

  filterProductsByPrice(min: number, max: number): Observable<Product[]> {
    return this.http.get<Product[]>(`api/products/filter?min=${min}&max=${max}`);
  }
  createProduct(formData: FormData) {
    return this.http.post(`/api/products`, formData);
  }
  // CRUD

  deleteProduct(id: number) {
    return this.http.delete(`/api/products/${id}`);
  }
  updateProduct(id: number, formData: FormData) {
    return this.http.put<Product>(`/api/products/${id}`, formData);
  }
}
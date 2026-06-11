import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl =
    'http://localhost:3000/api/products';

  constructor(
    private http: HttpClient
  ) {}

  getProducts(): Observable<Product[]> {

    return this.http.get<Product[]>(
      this.apiUrl
    );

  }

  getProductById(
    id: number
  ): Observable<Product> {

    return this.http.get<Product>(
      `${this.apiUrl}/${id}`
    );

  }

  searchProducts(
    keyword: string
  ): Observable<Product[]> {

    return this.http.get<Product[]>(
      `${this.apiUrl}/search?keyword=${keyword}`
    );

  }

  getBestSellers(): Observable<Product[]> {

    return this.http.get<Product[]>(
      `${this.apiUrl}/best-sellers`
    );

  }

  filterProductsByPrice(
    min: number,
    max: number
  ): Observable<Product[]> {

    return this.http.get<Product[]>(
      `${this.apiUrl}/filter?min=${min}&max=${max}`
    );

  }

}
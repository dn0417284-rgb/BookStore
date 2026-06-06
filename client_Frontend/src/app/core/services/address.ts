import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Address {
  address_id: number;
  receiver_name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address_detail: string;
  is_default: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private api =
    'http://localhost:3000/api/addresses';

  constructor(
    private http: HttpClient
  ) {}

  getAddresses(): Observable<any> {
    return this.http.get(this.api);
  }

  createAddress(data: any): Observable<any> {
    return this.http.post(this.api, data);
  }

  updateAddress(
    id: number,
    data: any
  ): Observable<any> {
    return this.http.put(
      `${this.api}/${id}`,
      data
    );
  }

  deleteAddress(
    id: number
  ): Observable<any> {
    return this.http.delete(
      `${this.api}/${id}`
    );
  }

  setDefaultAddress(
    id: number
  ): Observable<any> {
    return this.http.put(
      `${this.api}/${id}/default`,
      {}
    );
  }
}
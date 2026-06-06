import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {

  private api =
    'https://provinces.open-api.vn/api';

  constructor(
    private http: HttpClient
  ) {}

  getProvinces() {
    return this.http.get<any[]>(
      `${this.api}/p/`
    );
  }

  getDistricts(code: number) {
    return this.http.get<any>(
      `${this.api}/p/${code}?depth=2`
    );
  }

  getWards(code: number) {
    return this.http.get<any>(
      `${this.api}/d/${code}?depth=2`
    );
  }
}
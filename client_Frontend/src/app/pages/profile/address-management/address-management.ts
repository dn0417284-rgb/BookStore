import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // Thêm ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  AddressService,
  Address
} from '../../../core/services/address';

import {
  ProvinceService
} from '../../../core/services/province.service';

@Component({
  selector: 'app-address-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './address-management.html',
  styleUrl: './address-management.css'
})
export class AddressManagement implements OnInit {

  addresses: Address[] = [];

  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];

  selectedProvinceCode: number | null = null;
  selectedDistrictCode: number | null = null;

  form: any = {
    receiver_name: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    address_detail: ''
  };

  editingId: number | null = null;

  constructor(
    private addressService: AddressService,
    private provinceService: ProvinceService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef vào đây
  ) {}

  ngOnInit(): void {
    this.loadAddresses();
    this.loadProvinces();
  }

  loadAddresses(): void {
    this.addressService
      .getAddresses()
      .subscribe({
        next: (res: any) => {
          this.addresses = res.data || [];
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  saveAddress(): void {
    if (this.editingId) {
      this.addressService
        .updateAddress(
          this.editingId,
          this.form
        )
        .subscribe({
          next: () => {
            this.resetForm();
            this.loadAddresses();
          }
        });
      return;
    }

    this.addressService
      .createAddress(this.form)
      .subscribe({
        next: () => {
          this.resetForm();
          this.loadAddresses();
        }
      });
  }

  editAddress(address: Address): void {
    this.editingId = address.address_id;

    this.form = {
      receiver_name: address.receiver_name,
      phone: address.phone,
      province: address.province,
      district: address.district,
      ward: address.ward,
      address_detail: address.address_detail
    };

    const province = this.provinces.find(
      p => p.name === address.province
    );

    if (!province) {
      return;
    }

    this.selectedProvinceCode = province.code;

    this.provinceService
      .getDistricts(province.code)
      .subscribe(data => {
        this.districts = data.districts || [];

        const district = this.districts.find(
          (d: any) => d.name === address.district
        );

        if (!district) {
          this.cdr.detectChanges();
          return;
        }

        this.selectedDistrictCode = district.code;

        this.provinceService
          .getWards(district.code)
          .subscribe(res => {
            this.wards = res.wards || [];
            this.cdr.detectChanges(); // Khởi chạy cập nhật UI khi sửa địa chỉ
          });
      });
  }

  deleteAddress(id: number): void {
    if (!confirm('Xóa địa chỉ này?')) {
      return;
    }

    this.addressService
      .deleteAddress(id)
      .subscribe({
        next: () => {
          this.loadAddresses();
        }
      });
  }

  setDefault(id: number): void {
    this.addressService
      .setDefaultAddress(id)
      .subscribe({
        next: () => {
          this.loadAddresses();
        }
      });
  }

  resetForm(): void {
    this.editingId = null;
    this.selectedProvinceCode = null;
    this.selectedDistrictCode = null;

    this.districts = [];
    this.wards = [];

    this.form = {
      receiver_name: '',
      phone: '',
      province: '',
      district: '',
      ward: '',
      address_detail: ''
    };
    this.cdr.detectChanges();
  }

  loadProvinces(): void {
    this.provinceService
      .getProvinces()
      .subscribe(data => {
        this.provinces = data;
        this.cdr.detectChanges();
      });
  }

  onProvinceChange(): void {
    this.form.district = '';
    this.form.ward = '';
    this.selectedDistrictCode = null;
    this.districts = [];
    this.wards = [];

    if (!this.selectedProvinceCode) {
      this.cdr.detectChanges();
      return;
    }

    const provinceCode = this.selectedProvinceCode;

    this.provinceService
      .getDistricts(provinceCode)
      .subscribe(data => {
        this.districts = data.districts || [];

        const province = this.provinces.find(
          p => p.code == provinceCode
        );
        this.form.province = province?.name || '';
        
        // Buộc Angular phải vẽ lại DOM cho danh mục quận huyện ngay lập tức
        this.cdr.detectChanges(); 
      });
  }

  onDistrictChange(): void {
    this.form.ward = '';
    this.wards = [];

    if (!this.selectedDistrictCode) {
      this.cdr.detectChanges();
      return;
    }

    const districtCode = this.selectedDistrictCode;

    this.provinceService
      .getWards(districtCode)
      .subscribe(data => {
        this.wards = data.wards || [];

        const district = this.districts.find(
          d => d.code == districtCode
        );
        this.form.district = district?.name || '';
        
        // Buộc Angular phải vẽ lại DOM cho danh mục phường xã ngay lập tức
        this.cdr.detectChanges(); 
      });
  }

  selectWard(name: string): void {
    this.form.ward = name;
  }
}

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

import Swal from 'sweetalert2';

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

  errorMessage = '';
  successMessage = '';

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

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  saveAddress(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (this.editingId) {

      this.addressService
        .updateAddress(
          this.editingId,
          this.form
        )
        .subscribe({

          next: () => {

            this.successMessage =
              'Cập nhật địa chỉ thành công';

            this.resetForm();
            this.loadAddresses();

          },

          error: (err) => {

            this.errorMessage =
              err.error?.message ||
              'Không thể cập nhật địa chỉ';
            this.cdr.detectChanges();
          }

        });

      return;

    }

  this.addressService
    .createAddress(this.form)
    .subscribe({

      next: () => {

        this.successMessage =
          'Thêm địa chỉ thành công';

        this.resetForm();
        this.loadAddresses();

      },

      error: (err) => {

        this.errorMessage =
          err.error?.message ||
          'Không thể thêm địa chỉ';
        this.cdr.detectChanges();
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

  async deleteAddress(id: number): Promise<void> {

    const result = await Swal.fire({
      title: 'Xóa địa chỉ?',
      text: 'Bạn có chắc muốn xóa địa chỉ này không?',
      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',

      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    });

    if (!result.isConfirmed) {
      return;
    }

    this.addressService
      .deleteAddress(id)
      .subscribe({

        next: () => {

          this.loadAddresses();

          Swal.fire({
            toast: true,
            position: 'top-end',

            icon: 'success',
            title: 'Đã xóa địa chỉ',

            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });

        },

        error: () => {

          Swal.fire({
            toast: true,
            position: 'top-end',

            icon: 'error',
            title: 'Xóa địa chỉ thất bại',

            showConfirmButton: false,
            timer: 2000
          });

        }

      });
  }

  setDefault(id: number): void {

  this.addressService
    .setDefaultAddress(id)
    .subscribe({

      next: () => {

        this.loadAddresses();

        Swal.fire({
          toast: true,
          position: 'top-end',

          icon: 'success',
          title: 'Đã đặt làm địa chỉ mặc định',

          showConfirmButton: false,
          timer: 2000
        });

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

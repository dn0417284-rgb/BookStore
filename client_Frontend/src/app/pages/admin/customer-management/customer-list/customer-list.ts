import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  imports: [CommonModule],
  selector: 'app-customer-list',
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css',
})
export class CustomerList implements OnInit {
  customers = [
    {
      id: 1,
      full_name: 'Nguyễn Văn A',
      gender: 'Nam',
      email: 'vana@gmail.com',
      phone: '0901111111',
      address: '123 Lê Lợi, Hà Nội',
      warning_count: 0,
    },
    {
      id: 2,
      full_name: 'Trần Thị B',
      gender: 'Nữ',
      email: 'thib@gmail.com',
      phone: '0902222222',
      address: '45 Nguyễn Huệ, TP.HCM',
      warning_count: 1,
    },
    {
      id: 3,
      full_name: 'Lê Văn C',
      gender: 'Nam',
      email: 'vanc@gmail.com',
      phone: '0903333333',
      address: '78 Trần Phú, Đà Nẵng',
      warning_count: 2,
    },
    {
      id: 4,
      full_name: 'Phạm Thị D',
      gender: 'Nữ',
      email: 'thid@gmail.com',
      phone: '0904444444',
      address: '12 Hai Bà Trưng, Huế',
      warning_count: 0,
    },
    {
      id: 5,
      full_name: 'Hoàng Văn E',
      gender: 'Nam',
      email: 'vane@gmail.com',
      phone: '0905555555',
      address: '56 Lý Thường Kiệt, Hải Phòng',
      warning_count: 1,
    },
  ];

  currentPage = 1;

  totalPages = 3;

  ngOnInit(): void {
    this.customers;
  }

  deleteCustomer(id: number) {
    const confirmDelete = confirm('Bạn có chắc muốn xóa không?');

    if (confirmDelete) {
      this.customers = this.customers.filter((customer) => customer.id !== id);
    }
  }

  warningCustomer(id: number) {
    const customer = this.customers.find((customer) => customer.id === id);

    if (customer) {
      customer.warning_count++;

      alert('Đã cảnh báo khách hàng');
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}

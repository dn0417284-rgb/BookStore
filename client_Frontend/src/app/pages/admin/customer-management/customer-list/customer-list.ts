import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer } from '../../../../core/models/customer.model';
import { CustomerService } from '../../../../core/services/customerService';
@Component({
  imports: [CommonModule],
  standalone: true,
  selector: 'app-customer-list',
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css',
})
export class CustomerList implements OnInit {
  constructor(private customerService: CustomerService) {}
  customers: Customer[] = [];

  currentPage = 1;

  totalPages = 3;

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe((data: any) => {
      this.customers = data;
    });
  }

  deleteCustomer(id: number) {
    const confirmDelete = confirm('Bạn có chắc muốn xóa không?');

    if (confirmDelete) {
      this.customers = this.customers.filter((customer) => customer.customer_id !== id);
    }
  }

  warningCustomer(id: number) {
    const customer = this.customers.find((customer) => customer.customer_id === id);

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

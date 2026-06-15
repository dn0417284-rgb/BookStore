import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer } from '../../../../core/models/customer.model';
import { CustomerService } from '../../../../core/services/customerService';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-list.html',
  styleUrls: ['./customer-list.css', '../../admin-common.css'],
})
export class CustomerList implements OnInit {
  constructor(
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef,
  ) {}

  customers: Customer[] = [];
  pagedCustomers: Customer[] = [];

  currentPage = 1;
  pageSize = 7;
  totalPages = 1;

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe((data) => {
      this.customers = data;

      this.totalPages = Math.max(1, Math.ceil(this.customers.length / this.pageSize));

      this.currentPage = 1;
      this.updatePage();

      this.cdr.markForCheck();
    });
  }

  updatePage() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.pagedCustomers = this.customers.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePage();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }

  deleteCustomer(id: number) {
    this.customerService.deleteCustomer(id).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.loadCustomers();
      },
      error: (err) => {
        alert(err.error.message);
      },
    });
  }

  warningCustomer(id: number) {
    const customer = this.customers.find((c) => c.customer_id === id);

    if (customer) {
      customer.warning_count++;
    }
  }
}

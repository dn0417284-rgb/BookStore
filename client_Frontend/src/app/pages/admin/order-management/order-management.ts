import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  RouterModule
} from '@angular/router';

import {
  OrderService
} from '../../../core/services/order';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './order-management.html',
  styleUrl: './order-management.css'
})
export class OrderManagement implements OnInit {

  orders: any[] = [];
  filteredOrders: any[] = [];
  pagedOrders: any[] = [];

  loading = true;

  searchOrderId = '';
  searchCustomer = '';
  searchPhone = '';
  searchStatus = '';

  fromDate = '';
  toDate = '';

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {

    this.orderService
      .getAllOrders()
      .subscribe({

        next: (res) => {

          this.orders = res.data || [];

          this.orders.sort(
            (a: any, b: any) =>
              b.order_id - a.order_id
          );

          this.filteredOrders = [...this.orders];

          this.updatePagination();

          this.loading = false;
          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(err);

          this.loading = false;
          this.cdr.detectChanges();

        }

      });

  }

  search(): void {

    this.filteredOrders =
      this.orders.filter(order => {

        const matchOrderId =
          !this.searchOrderId ||
          order.order_id
            .toString()
            .includes(this.searchOrderId);

        const matchCustomer =

        !this.searchCustomer ||

        this.removeVietnameseTones(
          order.customer_name || ''
        )

        .includes(

          this.removeVietnameseTones(
            this.searchCustomer
          )

        );

        const matchPhone =
          !this.searchPhone ||
          order.phone
            ?.includes(this.searchPhone);

        const matchStatus =
          !this.searchStatus ||
          order.status === this.searchStatus;

        const orderDate =
          new Date(order.created_at);

        const matchFrom =
          !this.fromDate ||
          orderDate >= new Date(this.fromDate);

        const matchTo =
          !this.toDate ||
          orderDate <= new Date(this.toDate + 'T23:59:59');

        return (
          matchOrderId &&
          matchCustomer &&
          matchPhone &&
          matchStatus &&
          matchFrom &&
          matchTo
        );

      });

    this.currentPage = 1;

    this.updatePagination();

  }

  resetFilter(): void {

    this.searchOrderId = '';
    this.searchCustomer = '';
    this.searchPhone = '';
    this.searchStatus = '';
    this.fromDate = '';
    this.toDate = '';

    this.filteredOrders =
      [...this.orders];

    this.currentPage = 1;

    this.updatePagination();

  }

  updatePagination(): void {

    this.totalPages =
      Math.ceil(
        this.filteredOrders.length /
        this.pageSize
      );

    const start =
      (this.currentPage - 1)
      * this.pageSize;

    const end =
      start + this.pageSize;

    this.pagedOrders =
      this.filteredOrders.slice(
        start,
        end
      );

  }

  changePage(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages
    ) {
      return;
    }

    this.currentPage = page;

    this.updatePagination();

  }

  getSTT(index: number): number {

    return (
      (this.currentPage - 1)
      * this.pageSize +
      index +
      1
    );

  }

  getStatusText(
    status: string
  ): string {

    switch (status) {

      case 'PENDING':
        return 'Chờ xác nhận';

      case 'CONFIRMED':
        return 'Đã xác nhận';

      case 'PACKING':
        return 'Đang đóng gói';

      case 'SHIPPING':
        return 'Đang giao';

      case 'DELIVERED':
        return 'Đã giao';

      case 'RECEIVED':
        return 'Đã nhận hàng';

      case 'FAILED':
        return 'Giao thất bại';

      case 'CANCELLED':
        return 'Đã hủy';

      default:
        return status;

    }

  }

  getPages(): number[] {

    return Array.from(
      {
        length: this.totalPages
      },
      (_, i) => i + 1
    );

  }

  removeVietnameseTones(str: string): string {
    return str
      ?.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim();

  }

}
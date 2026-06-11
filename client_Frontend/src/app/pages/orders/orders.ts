

import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterModule
} from '@angular/router';

import {
  OrderService
} from '../../core/services/order';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class Orders implements OnInit {

  // SỬA LỖI BIÊN DỊCH TEMPLATE: Ép mảng kiểu any để HTML gọi được các thuộc tính thanh toán mới
  orders: any[] = [];

  currentPage = 1;
  itemsPerPage = 6;

  get paginatedOrders(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.orders.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.orders.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (
      page >= 1 &&
      page <= this.totalPages
    ) {
      this.currentPage = page;
    }
  }

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService
      .getMyOrders()
      .subscribe({
        next: (data: any) => {
          // Xử lý an toàn: Nhận diện mảng dữ liệu dù Backend trả về dạng bọc data hay mảng trực tiếp
          this.orders = data?.data || data || [];
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  /**
   * BỔ SUNG: Xử lý nút bấm "Thanh toán ngay" cho đơn hàng MoMo / ZaloPay chưa trả tiền
   */
  repayOrder(order: any): void {
    if (!order || !order.order_id) return;

    this.orderService.getRepayUrl(order.order_id).subscribe({
      next: (res: any) => {
        const paymentUrl = res.paymentUrl || res.payUrl || res.data?.paymentUrl;
        if (paymentUrl) {
          // Chuyển hướng trình duyệt người dùng thẳng đến màn hình hóa đơn quét mã QR của Ví
          window.location.href = paymentUrl;
        } else {
          alert('Không thể tạo lại liên kết thanh toán trực tuyến. Vui lòng thử lại.');
        }
      },
      error: (err) => {
        console.error('Lỗi API khởi tạo lại thanh toán:', err);
        alert('Cổng thanh toán trực tuyến đang gặp sự cố kết nối. Vui lòng thử lại sau.');
      }
    });
  }

  getStatusText(status: string): string {
    if (!status) return 'Đang xử lý';

    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'Chờ xác nhận';

      case 'CONFIRMED':
        return 'Đã xác nhận';

      case 'SHIPPING':
        return 'Đang giao hàng';

      case 'COMPLETED':
        return 'Hoàn thành';

      case 'CANCELLED':
        return 'Đã hủy';

      default:
        return status;
    }
  }

  get pages(): (number | string)[] {
    const total = this.totalPages;

    if (total <= 7) {
      return Array.from(
        { length: total },
        (_, i) => i + 1
      );
    }

    const result: (number | string)[] = [];
    result.push(1);

    if (this.currentPage > 3) {
      result.push('...');
    }

    for (
      let i = Math.max(2, this.currentPage - 1);
      i <= Math.min(total - 1, this.currentPage + 1);
      i++
    ) {
      result.push(i);
    }

    if (this.currentPage < total - 2) {
      result.push('...');
    }

    result.push(total);
    return result;
  }

}

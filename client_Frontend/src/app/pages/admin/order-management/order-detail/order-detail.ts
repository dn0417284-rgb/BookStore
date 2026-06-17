import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminOderService } from '../../../../core/services/admin_orderService';
import { Order } from '../../../../core/models/order.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-order-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
})
export class OrderDetail implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private orderService: AdminOderService,
    private cdr: ChangeDetectorRef,
  ) {}
  order!: Order;
  selectedStatus!: Order['status'];
  statuses = [
    'PENDING',
    'CONFIRMED',
    'PACKING',
    'SHIPPING',
    'DELIVERED',
    'RECEIVED',
    'FAILED',
    'CANCELLED',
  ];
  ngOnInit(): void {

  const id = Number(
    this.route.snapshot.paramMap.get('id')
  );

  console.log('ORDER ID:', id);

  this.orderService
    .getOrderById(id)
    .subscribe({

      next: (res: any) => {

        console.log('API RESPONSE:', res);

        this.order = res.data;

        this.selectedStatus = '' as any;

        this.cdr.detectChanges();
      },

      error: (err) => {

        console.error(
          'ORDER DETAIL ERROR:',
          err
        );

      }

    });

}

  updateStatus(): void {

  if (!this.selectedStatus) {
    return;
  }

  this.orderService
    .updateStatus(
      this.order.order_id,
      this.selectedStatus
    )
    .subscribe({

      next: () => {

        this.order.status =
          this.selectedStatus;

        this.selectedStatus =
          '' as any;

        this.cdr.detectChanges();

        alert('Cập nhật thành công');

      }

    });

}

  getStatusText(status: string): string {
    const map: { [key: string]: string } = {
      PENDING: 'Chờ xác nhận',
      CONFIRMED: 'Đã xác nhận',
      PACKING: 'Đang đóng gói',
      SHIPPING: 'Đang giao hàng',
      DELIVERED: 'Đã giao hàng',
      RECEIVED: 'Đã nhận hàng',
      FAILED: 'Giao hàng thất bại',
      CANCELLED: 'Đã hủy',
    };

    return map[status] || status;
  }
  getPaymentStatusText(status: string): string {
    const map: any = {
      UNPAID: 'Chưa thanh toán',
      PAID: 'Đã thanh toán',
      REFUNDED: 'Đã hoàn tiền',
    };
    return map[status] || status;
  }
  getAvailableStatuses(current: string): string[] {
    const flow: any = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['PACKING'],
      PACKING: ['SHIPPING'],
      SHIPPING: ['DELIVERED', 'FAILED'],
      DELIVERED: ['RECEIVED'],
      RECEIVED: [],
      FAILED: [],
      CANCELLED: [],
    };

    return flow[current] || [];
  }
}

import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  RouterModule
} from '@angular/router';

import {
  OrderService
} from '../../core/services/order';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css'
})
export class OrderDetail implements OnInit {

  orderId: number = 0;

  order: any = null;

  loading: boolean = true;

  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    console.log('OrderDetail INIT');

    this.orderId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    console.log(
      'Loading order:',
      this.orderId
    );

    this.loadOrder();

  }

  loadOrder(): void {

    this.loading = true;

    this.orderService
      .getOrderDetail(this.orderId)
      .subscribe({

        next: (res: any) => {

          console.log(
            'SUCCESS:',
            res
          );

          if (
            res &&
            res.success &&
            res.data
          ) {

            this.order = res.data;

          } else {

            this.error =
              'Không tìm thấy đơn hàng';

          }

          this.loading = false;

          this.cdr.detectChanges();

          console.log('loading=', this.loading);
          console.log('order=', this.order);
        },

        error: (err) => {

          console.error(
            'ERROR:',
            err
          );

          this.error =
            'Không thể tải đơn hàng';

          this.loading = false;

        }

      });

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
        return 'Đang giao hàng';

      case 'DELIVERED':
        return 'Đã giao hàng';

      case 'RECEIVED':
        return 'Đã nhận hàng';

      case 'FAILED':
        return 'Giao thất bại';

      case 'CANCELLED':
        return 'Đã hủy';

      default:
        return status || '';

    }

  }

    // BỔ SUNG HÀM NÀY VÀO TRONG CLASS OrderDetail (Dưới hàm getStatusText)
  getPaymentStatusText(paymentStatus: string): string {
    switch (paymentStatus) {
      case 'UNPAID':
        return 'Chưa thanh toán';
      case 'PAID':
        return 'Đã thanh toán';
      case 'REFUNDED':
        return 'Đã hoàn tiền';
      default:
        return paymentStatus || 'Chưa thanh toán';
    }
  }

  // Thêm hàm định dạng class màu sắc cho trạng thái thanh toán (nếu muốn làm CSS)
  getPaymentStatusClass(): string {
    return this.order?.payment_status 
      ? this.order.payment_status.toLowerCase() 
      : 'unpaid';
  }


  getStatusClass(): string {

    return this.order?.status
      ? this.order.status.toLowerCase()
      : '';

  }

  getPaymentClass(): string {

    return this.order?.payment_method
      ? this.order.payment_method.toLowerCase()
      : '';

  }

  cancelOrder(): void {

    const ok =
      confirm(
        'Bạn chắc chắn muốn hủy đơn hàng?'
      );

    if (!ok) {
      return;
    }

    this.orderService
      .cancelOrder(this.orderId)
      .subscribe({

        next: (res) => {

          alert(
            res.message
          );

          this.loadOrder();

        },

        error: (err) => {

          alert(
            err.error?.message ||
            'Không thể hủy đơn'
          );

        }

      });

  }

}
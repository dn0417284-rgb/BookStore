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

import Swal from 'sweetalert2';

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

    //console.log('OrderDetail INIT');

    this.orderId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    // console.log(
    //   'Loading order:',
    //   this.orderId
    // );

    this.loadOrder();

  }

  loadOrder(): void {

    this.loading = true;

    this.orderService
      .getOrderDetail(this.orderId)
      .subscribe({

        next: (res: any) => {

          // console.log(
          //   'SUCCESS:',
          //   res
          // );

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

          // console.log('loading=', this.loading);
          // console.log('order=', this.order);
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
  
  repayOrder(): void {

    if (!this.order) {
      return;
    }

    this.orderService
      .repayOrder(this.order.order_id)
      .subscribe({

        next: (res: any) => {

          const paymentUrl =
            res.paymentUrl ||
            res.data?.paymentUrl;

          if (paymentUrl) {
            window.location.href = paymentUrl;
          } else {
            alert('Không tạo được link thanh toán');
          }

        },

        error: (err) => {

          console.error(err);

          alert(
            err.error?.message ||
            'Không thể thanh toán lại'
          );

        }

      });

  }

  payAgain(): void {

    if (!this.order) {
      return;
    }

    this.orderService
      .repayOrder(this.order.order_id)
      .subscribe({

        next: (res: any) => {

          const paymentUrl =
            res.paymentUrl ||
            res.payUrl;

          if (paymentUrl) {
            window.location.href = paymentUrl;
          } else {
            alert('Không lấy được link thanh toán');
          }

        },

        error: (err) => {

          console.error(err);

          alert(
            err.error?.message ||
            'Không thể tạo lại thanh toán'
          );

        }

      });

  }

  cancelOrder(): void {

  Swal.fire({
    title: 'Hủy đơn hàng?',
    text: 'Bạn có chắc muốn hủy đơn hàng này?',
    icon: 'warning',

    width: 420,

    showCancelButton: true,

    confirmButtonText: 'Hủy đơn',
    cancelButtonText: 'Quay lại',

    reverseButtons: true,

    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b'
  }).then((result) => {

    if (!result.isConfirmed) {
      return;
    }

    this.orderService
      .cancelOrder(this.order.order_id)
      .subscribe({

        next: (res: any) => {

          Swal.fire({
            icon: 'success',
            title: 'Đã hủy đơn hàng',
            text: res.message,
            timer: 1800,
            showConfirmButton: false,
            width: 400
          });

          this.loadOrder();

        },

        error: (err) => {

          Swal.fire({
            icon: 'error',
            title: 'Không thể hủy',
            text:
              err.error?.message ||
              'Đã xảy ra lỗi',
            width: 400
          });

        }

      });

  });

}

  
}
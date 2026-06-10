import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-detail',
  imports: [],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
})
export class OrderDetail {
  //   orderId = 0;
  //   order: any = null;
  //   loading = true;
  //   error = '';
  //   selectedStatus = '';
  //   constructor(
  //     private orderService: OrderService,
  //     private cdr: ChangeDetectorRef,
  //   ) {}
  //   ngOnInit(): void {
  //     this.orderId = Number(this.route.snapshot.paramMap.get('id'));
  //     this.loadOrder();
  //   }
  //   loadOrder(): void {
  //     this.loading = true;
  //     this.orderService.getOrderDetailAdmin(this.orderId).subscribe({
  //       next: (res: any) => {
  //         this.order = res.data;
  //         this.selectedStatus = this.order.status;
  //         this.loading = false;
  //         this.cdr.detectChanges();
  //       },
  //       error: (err) => {
  //         console.error(err);
  //         this.error = 'Không tải được đơn hàng';
  //         this.loading = false;
  //       },
  //     });
  //   }
  //   updateStatus(): void {
  //     this.orderService.updateOrderStatus(this.orderId, this.selectedStatus).subscribe({
  //       next: () => {
  //         alert('Cập nhật trạng thái thành công');
  //         this.loadOrder();
  //       },
  //       error: (err) => {
  //         console.error(err);
  //         alert('Cập nhật thất bại');
  //       },
  //     });
  //   }
  //   getStatusText(status: string): string {
  //     switch (status) {
  //       case 'PENDING':
  //         return 'Chờ xác nhận';
  //       case 'CONFIRMED':
  //         return 'Đã xác nhận';
  //       case 'PACKING':
  //         return 'Đang đóng gói';
  //       case 'SHIPPING':
  //         return 'Đang giao hàng';
  //       case 'DELIVERED':
  //         return 'Đã giao hàng';
  //       case 'RECEIVED':
  //         return 'Đã nhận hàng';
  //       case 'FAILED':
  //         return 'Giao thất bại';
  //       case 'CANCELLED':
  //         return 'Đã hủy';
  //       default:
  //         return status;
  //     }
  //   }
  //   getStatusClass(): string {
  //     return this.order?.status?.toLowerCase() || '';
  //   }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminOderService } from '../../../../core/services/admin_orderService';
import { Order } from '../../../../core/models/order.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  ) {}
  order!: Order;

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
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.orderService.getOrderById(id).subscribe({
      next: (res: any) => {
        this.order = res.data;
      },
    });
  }
  updateStatus(): void {
    this.orderService.updateStatus(this.order.order_id, this.order.status).subscribe({
      next: () => {
        alert('Cập nhật trạng thái thành công');
      },
    });
  }
  cancelOrder(): void {
    if (!confirm('Hủy đơn hàng này?')) return;

    this.orderService.cancelOrder(this.order.order_id).subscribe({
      next: () => {
        this.order.status = 'CANCELLED';

        alert('Đã hủy đơn hàng');
      },
    });
  }
}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Order } from '../../../../core/models/order.model';
import { AdminOderService } from '../../../../core/services/admin_orderService';
import { Router } from '@angular/router';
@Component({
  selector: 'app-order-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './order-list.html',
  styleUrls: ['./order-list.css', '../../admin-common.css'],
})
export class OrderList implements OnInit {
  constructor(
    private orderService: AdminOderService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchTerm = '';
  fromDate = '';
  toDate = '';
  currentPage = 1;
  pageSize = 8;
  selectedStatus = '';

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOders().subscribe({
      next: (res: any) => {
        this.orders = res.data;
        this.filteredOrders = [...this.orders];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải danh đơn hàng:', err);
      },
    });
  }

  searchOrders(): void {
    const keyword = this.searchTerm.trim().toLowerCase();

    this.filteredOrders = this.orders.filter((order) => {
      const matchKeyword =
        !keyword ||
        order.customer_name?.toLowerCase().includes(keyword) ||
        order.order_code?.toLowerCase().includes(keyword);

      const matchStatus = !this.selectedStatus || order.status === this.selectedStatus;

      let matchDate = true;
      const createdDate = new Date(order.created_at);

      if (this.fromDate) {
        const from = new Date(this.fromDate);
        matchDate = matchDate && createdDate >= from;
      }

      if (this.toDate) {
        const to = new Date(this.toDate);
        to.setHours(23, 59, 59, 999);
        matchDate = matchDate && createdDate <= to;
      }

      return matchKeyword && matchDate && matchStatus;
    });

    this.currentPage = 1;
  }
  resetSearch(): void {
    this.searchTerm = '';
    this.fromDate = '';
    this.toDate = '';
    this.selectedStatus = '';
    this.filteredOrders = [...this.orders];
    this.currentPage = 1;
  }
  get pagedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredOrders.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.pageSize) || 1;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getStatusText(status: string): string {
    const map: { [key: string]: string } = {
      PENDING: 'Chờ xác nhận',
      CONFIRMED: 'Đã xác nhận',
      PACKING: 'Đang đóng gói',
      SHIPPING: 'Đang giao',
      DELIVERED: 'Đã giao hàng',
      RECEIVED: 'Đã nhận hàng',
      FAILED: 'Giao thất bại',
      CANCELLED: 'Đã hủy',
    };
    return map[status] || status;
  }

  viewOrder(id: number): void {
    this.router.navigate(['/orders', id]);
  }

  cancelOrder(id: number): void {
    if (!confirm('Bạn có chắc muốn hủy đơn này?')) {
      return;
    }

    this.orderService.cancelOrder(id).subscribe({
      next: () => {
        this.loadOrders();
        alert('Hủy đơn hàng thành công');
      },
      error: () => {
        alert('Hủy đơn hàng thất bại');
      },
    });
  }
}

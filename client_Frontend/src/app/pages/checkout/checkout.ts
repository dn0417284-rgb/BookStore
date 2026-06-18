// cd C:\ngrok
//ngrok http 3000
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';

import { CartService } from '../../core/services/cart';
import { CartItem } from '../../core/models/cart-item.model';
import { OrderService } from '../../core/services/order';
import { AddressService, Address } from '../../core/services/address';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class Checkout implements OnInit {

  items: CartItem[] = [];
  note = '';
  isBuyNowMode = false;
  isSubmitting = false; 

  showZaloPayMessage = false;
  showSuccessMessage = false;

  paymentMethod: 'COD' | 'MOMO' | 'ZALOPAY' = 'COD';

  addresses: Address[] = [];
  selectedAddressId: number | null = null;
  selectedAddress: Address | null = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private addressService: AddressService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAddresses();
    this.initCheckoutItems();
  }

  goToProductDetail(event: Event, item: CartItem): void {
    event.preventDefault();
    event.stopPropagation();

    const productId = item.product?.product_id || (item.product as any)?.id;
    
    if (productId) {
      this.router.navigate(['/product', productId]);
    } else {
      console.error('Không tìm thấy ID của sản phẩm:', item);
    }
  }

  private initCheckoutItems(): void {
    const buyNowItem = this.cartService.getBuyNowItem();

    if (buyNowItem) {//muangay
      this.isBuyNowMode = true;
      this.items = [{ ...buyNowItem }];//
      this.cartService.clearBuyNowItem();
    } else {//giỏ hàng
      const checkoutItems = localStorage.getItem('checkoutItems');
      this.items = checkoutItems ? JSON.parse(checkoutItems) : [];//
      
      if (this.items.length === 0) {
        this.router.navigate(['/cart']);
      }
    }
  }

  loadAddresses(): void {
    this.addressService
      .getAddresses()
      .subscribe({
        next: (res: any) => {
          this.addresses = res.data || [];

          if (this.addresses.length === 0) {
            this.cdr.detectChanges();
            return;
          }

          const defaultAddress = this.addresses.find((a: any) => a.is_default);

          if (defaultAddress) {
            this.selectAddress(defaultAddress);
          } else {
            this.selectAddress(this.addresses[0]);
          }
          this.cdr.detectChanges(); 
        },
        error: (err: any) => {
          console.error('Không thể tải danh sách địa chỉ:', err);
        }
      });
  }

  selectAddress(address: Address): void {
    this.selectedAddress = address;
    this.selectedAddressId = address.address_id;
  }

  total(): number {
    return this.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
  }

  placeOrder(): void {
    if (this.paymentMethod === 'ZALOPAY') {
    this.showZaloPayMessage = true;
    return;
  }

  this.showZaloPayMessage = false;

  if (!this.selectedAddress) {
    alert('Vui lòng chọn địa chỉ nhận hàng');
    return;
  }

    if (this.isSubmitting) return;//đang gửi đơn không cho bấm
    this.isSubmitting = true;

    // Ghép chuỗi địa chỉ đầy đủ phòng trường hợp Backend yêu cầu trường địa chỉ text thô
    const fullAddressText = `${this.selectedAddress.address_detail}, ${this.selectedAddress.ward}, ${this.selectedAddress.district}, ${this.selectedAddress.province}`;

    // FIX LỖI 500: Bổ sung toàn bộ các trường thông tin liên hệ mà Database yêu cầu bắt buộc
    const orderData = {
      address_id: this.selectedAddress.address_id,
      customer_name: this.selectedAddress.receiver_name, 
      phone: this.selectedAddress.phone,         
      address: fullAddressText,                  
      payment_method: this.paymentMethod,
      note: this.note.trim(),
      total_amount: this.total(),
      items: this.items.map(item => ({
      product_id: item.product.product_id || (item.product as any).id,
      quantity: item.quantity,
      price: item.product.price,

      title: item.product.title,
      author: item.product.author,
      image: item.product.image
    }))
    };

    //console.log('ORDER DATA GỬI LÊN:', orderData);

    this.orderService
      .createOrder(orderData)//
      .subscribe({
        next: (res: any) => {
          //nhận res.paymentUrl 
          // ==========================================
          // XỬ LÝ THANH TOÁN ONLINE (MOMO / ZALOPAY)
          // ==========================================
          if (this.paymentMethod === 'MOMO' || this.paymentMethod === 'ZALOPAY') {
            const paymentUrl = res.paymentUrl || res.payUrl || res.data?.paymentUrl;
            
            if (paymentUrl) {
              // Phải subscribe hành động dọn dẹp giỏ hàng trước khi chuyển hướng trang
              this.clearCartStateAfterOrder().subscribe({
                next: () => {//------
                  this.cartService.loadCart(); // Cập nhật lại số lượng badge giỏ hàng trên Header
                  window.location.href = paymentUrl; // Chuyển hướng sang MoMo/ZaloPay
                },
                error: (err) => {
                  console.error('Lỗi dọn giỏ hàng trước khi nhảy trang:', err);
                  window.location.href = paymentUrl; // Vẫn cho đi tiếp kể cả lỗi dọn giỏ
                }
              });
            } else {
              alert('Không thể khởi tạo liên kết thanh toán trực tuyến. Vui lòng thử lại.');
              this.isSubmitting = false;
            }
            return;
          }

          // ==========================================
          // XỬ LÝ THANH TOÁN COD TRUYỀN THỐNG
          // ==========================================
          this.clearCartStateAfterOrder().subscribe({
            next: () => this.finalizeCheckoutSuccess(),
            error: (err: any) => {
              console.error('Lỗi khi dọn dẹp các sản phẩm trong giỏ hàng:', err);
              this.finalizeCheckoutSuccess();
            }
          });
        },
        error: (err: any) => {
          console.error('Lỗi tạo đơn hàng từ API:', err);
          alert('Khởi tạo đơn hàng không thành công. Vui lòng kiểm tra lại dữ liệu.');
          this.isSubmitting = false;
        }
      });
  }

  private clearCartStateAfterOrder(): Observable<any> {
    localStorage.removeItem('checkoutItems');
    
    if (!this.isBuyNowMode) {
      const requests = this.items.map(item => {
        const pId = item.product.product_id || (item.product as any).id;
        return this.cartService.removeItem(pId);
      });
      return forkJoin(requests);
    }
    
    return of(null);
  }

  private finalizeCheckoutSuccess(): void {
    this.cartService.loadCart();
    this.isSubmitting = false;

    this.showSuccessMessage = true;

    this.cdr.detectChanges();

    setTimeout(() => {
      this.router.navigate(['/orders']);
    }, 1500);
  }

  increaseQuantity(productId: number): void {
    const item = this.items.find(i => (i.product.product_id === productId || (i.product as any).id === productId));
    if (item) {
      item.quantity++;
      this.syncLocalStorageWithQuantity();
    }
  }

  decreaseQuantity(productId: number): void {
    const item = this.items.find(i => (i.product.product_id === productId || (i.product as any).id === productId));
    if (item && item.quantity > 1) {
      item.quantity--;
      this.syncLocalStorageWithQuantity();
    }
  }

  private syncLocalStorageWithQuantity(): void {
    if (!this.isBuyNowMode) {
      localStorage.setItem('checkoutItems', JSON.stringify(this.items));
    }
  }

  get isZaloPaySelected(): boolean {
    return this.paymentMethod === 'ZALOPAY';
  }

}

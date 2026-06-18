import {
  Component,
  OnInit,
  ElementRef,    /* Thêm import để xác định vị trí Header */
  HostListener,  /* Thêm import để lắng nghe sự kiện click toàn trang */
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router,
  RouterModule
} from '@angular/router';

import {
  FormsModule
} from '@angular/forms';

import {
  CartService
} from '../../core/services/cart';

import {
  AuthService
} from '../../core/services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit {

  cartCount = 0;
  searchKeyword = '';
  showUserMenu = false;

  get isAdmin(): boolean {
    return this.customer?.role === 'admin';
  }

  get customer(): any {
    return this.auth.getCurrentUser();
  }

  // Inject thêm ElementRef vào constructor để Angular quản lý DOM của component này
  constructor(
    private cartService: CartService,
    private auth: AuthService,
    private router: Router,
    private elRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cartService.loadCart();

    this.cartService.cart$.subscribe(items => {

    this.cartCount = items.reduce(
      (sum, item) => sum + Number(item.quantity),
      0
    );

    this.cdr.detectChanges();

  });
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  loadCartCount(): void {

    this.cartService
      .getCart()
      .subscribe({

        next: (res: any) => {

          this.cartCount =
            (res.data || []).reduce(

              (sum: number, item: any) =>

                sum + Number(item.quantity),

              0

            );

        },

        error: (err) => {

          console.error(
            'LOAD CART COUNT ERROR',
            err
          );

        }

      });

  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {

    const clickedInside =
      this.elRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.showUserMenu = false;
    }

  }

  @HostListener('window:cart-updated')
    onCartUpdated(): void {

      this.loadCartCount();

    }

  search(): void {
    const keyword = this.searchKeyword.trim();

    this.router.navigate(['/'], {
      queryParams: keyword ? { keyword } : {} 
    });

  }

  clearSearch(): void {

    this.searchKeyword = '';

    this.router.navigate(['/']); // xoá query luôn

  }

  logout(): void {
    this.auth.logout();
    this.showUserMenu = false; 
    this.router.navigate(['/']);
  }
}  
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule,
  Location
} from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  Product
} from '../../core/models/product.model';

import {
  ProductService
} from '../../core/services/product-service';

import {
  CartService
} from '../../core/services/cart';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './product-detail.html',
  styleUrls: [
    './product-detail.css'
  ]
})
export class ProductDetail implements OnInit {

  product: Product | null = null;

  loading = true;

  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      const id =
        Number(params.get('id'));

      this.loading = true;

      this.productService
        .getProductById(id)
        .subscribe({

          next: (data) => {

            this.product = data;

            this.loading = false;

            this.cdr.detectChanges();

          },

          error: (err) => {

            console.error(err);

            this.loading = false;

            this.cdr.detectChanges();

          }

        });

    });

  }

  goBack(): void {

    this.location.back();

  }

  increaseQuantity(): void {

    this.quantity++;

  }

  decreaseQuantity(): void {

    if (this.quantity > 1) {

      this.quantity--;

    }

  }

  addToCart(): void {

  if (!this.product) return;

  if (this.quantity < 1) {

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'warning',
      title: 'Số lượng không hợp lệ ',
      showConfirmButton: false,
      timer: 2000
    });

    this.quantity = 1;
    return;
  }

  this.cartService
    .addToCart(this.product.product_id, this.quantity)
    .subscribe({

      next: () => {

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Đã thêm ${this.quantity} "${this.product?.title}" vào giỏ hàng`,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });

        this.quantity = 1;
      },

      error: () => {

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Không thể thêm vào giỏ hàng',
          showConfirmButton: false,
          timer: 2000
        });

      }
    });
}

  buyNow(event: Event): void {

    event.preventDefault();

    event.stopPropagation();

    if (!this.product) {

      return;

    }

    const deepCloneProduct =
      JSON.parse(
        JSON.stringify(this.product)
      );

    this.cartService.setBuyNowItem({

      product: deepCloneProduct,

      quantity: this.quantity

    });

    this.router.navigate([
      '/checkout'
    ]);

  }

}
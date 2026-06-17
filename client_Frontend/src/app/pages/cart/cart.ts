import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Router,
  RouterModule,
  RouterLink
} from '@angular/router';

import {
  CartService
} from '../../core/services/cart';

import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart implements OnInit {

  items: any[] = [];

  selectedItems: number[] = [];

  selectAll = false;
  
  constructor(
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

  console.log('CART INIT');

  this.cartService.cart$
    .subscribe(items => {

      console.log('CART SUBJECT:', items);

      this.items = items || [];

      this.cdr.detectChanges();

    });

  this.cartService.loadCart();

}

  total(): number {

    return this.items.reduce(

      (sum, item) =>

        sum +
        Number(item.price) *
        item.quantity,

      0

    );

  }

  selectedCount(): number {

    return this.selectedItems.length;

  }

  selectedTotal(): number {

    return this.items
      .filter(item =>
        this.selectedItems.includes(
          item.product_id
        )
      )
      .reduce(

        (sum, item) =>

          sum +
          Number(item.price) *
          item.quantity,

        0

      );

  }

  toggleItem(
    productId: number
  ): void {

    const index =
      this.selectedItems.indexOf(
        productId
      );

    if (index > -1) {

      this.selectedItems.splice(
        index,
        1
      );

    } else {

      this.selectedItems.push(
        productId
      );

    }

    this.selectAll =
      this.selectedItems.length ===
      this.items.length;

  }

  toggleAll(): void {

    if (this.selectAll) {

      this.selectedItems =
        this.items.map(
          item => item.product_id
        );

    } else {

      this.selectedItems = [];

    }

  }

deleteSelected(): void {

  const requests =
    this.selectedItems.map(id =>
      this.cartService.removeItem(id)
    );

  forkJoin(requests).subscribe({

    next: () => {

      this.selectedItems = [];
      this.selectAll = false;

    },

    error: (err) => {

      console.error(err);

    }

  });

}
  checkoutSingle(item: any): void {

  const checkoutItem = {
    quantity: item.quantity,
    product: {
      product_id: item.product_id,
      title: item.title,
      author: item.author,
      image: item.image,
      price: item.price
    }
  };

  localStorage.setItem(
    'checkoutItems',
    JSON.stringify([checkoutItem])
  );

  this.router.navigate(['/checkout']);

}

  checkoutSelected(): void {

  const selectedProducts =
    this.items
      .filter(item =>
        this.selectedItems.includes(
          item.product_id
        )
      )
      .map(item => ({
        quantity: item.quantity,
        product: {
          product_id: item.product_id,
          title: item.title,
          author: item.author,
          image: item.image,
          price: item.price
        }
      }));

  localStorage.setItem(
    'checkoutItems',
    JSON.stringify(selectedProducts)
  );

  this.router.navigate(['/checkout']);

}

  increaseQuantity(item: any): void {

  this.cartService
    .updateQuantity(
      item.product_id,
      item.quantity + 1
    )
    .subscribe({

      next: () => {

      }

    });

}

decreaseQuantity(item: any): void {

  if (item.quantity <= 1) {

    return;

  }

  this.cartService
    .updateQuantity(
      item.product_id,
      item.quantity - 1
    )
    .subscribe({

      next: () => {

      }

    });

}

removeItem(productId: number): void {

  this.cartService
    .removeItem(productId)
    .subscribe({

      error: (err) => {

        console.error(err);

      }

    });

}

}
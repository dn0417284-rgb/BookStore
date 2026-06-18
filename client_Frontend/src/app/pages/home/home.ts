
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
  Router,
  RouterLink
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

import { FormsModule } from '@angular/forms';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  products: Product[] = [];        // Danh sách sách hiển thị thực tế trên màn hình
  filteredProducts: Product[] = []; // Danh sách sách sau khi lọc từ khóa/tab nhưng chưa phân trang
  allProducts: Product[] = [];      // Toàn bộ kho sách gốc lấy từ server
  bestSellerCache: Product[] = [];

  minPrice: number | null = null;
  maxPrice: number | null = null;

  authorKeyword = '';
  titleKeyword = '';

  currentTab: 'best-seller' | 'all' = 'best-seller';
  
  quantities: { [key: number]: number } = {};

  // ==========================================
  // CÁC BIẾN QUẢN LÝ PHÂN TRANG (PAGINATION)
  // ==========================================
  currentPage = 1;      // Trang hiện tại
  pageSize = 10;        // ĐÃ SỬA: Hiển thị đúng 10 quyển trên 1 trang
  totalPages = 1;       // Tổng số trang tính toán được
  pagesArray: (number | string)[] = []; // Mảng chứa danh sách số trang hiển thị
  
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private ctx: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  this.loadProducts();

  if (this.currentTab === 'best-seller') {
    this.loadBestSellers();
  }

  this.route.queryParams.subscribe(params => {
    const keyword = (params['keyword'] || '').trim();

    this.applyGlobalFilter(keyword);
  });
}

  applyGlobalFilter(keyword: string): void {

  const lower = keyword.toLowerCase().trim();

  let source: Product[] =
    this.currentTab === 'best-seller'
      ? this.bestSellerCache
      : this.allProducts;

  let result = source;

  if (lower) {
    result = source.filter(p =>
      p.title?.toLowerCase().includes(lower) ||
      p.author?.toLowerCase().includes(lower)
    );
  }

  this.filteredProducts = result;
  this.currentPage = 1;

  if (this.currentTab === 'best-seller') {

    this.products = result;

  } else {

    this.updatePagination();

  }
}



 loadProducts(): void {
  this.productService.getProducts().subscribe({
    next: (res: Product[]) => {
      this.allProducts = res;

      this.allProducts.forEach(p => {
        if (!this.quantities[p.product_id]) {
          this.quantities[p.product_id] = 1;
        }
      });

      const keyword = (this.route.snapshot.queryParamMap.get('keyword') || '').trim();

      this.applyGlobalFilter(keyword);
      this.ctx.detectChanges();

    }
  });
}

  loadBestSellers(): void {
  this.productService.getBestSellers().subscribe({
    next: (res: Product[]) => {

      this.bestSellerCache = res;

      const keyword = (this.route.snapshot.queryParamMap.get('keyword') || '').trim();

      let result = res;

      if (keyword) {
        const lower = keyword.toLowerCase();
        result = res.filter(p =>
          p.title?.toLowerCase().includes(lower) ||
          p.author?.toLowerCase().includes(lower)
        );
      }

      this.filteredProducts = result;
      this.products = result;
      this.ctx.detectChanges();
    },
    error: (err) => console.error(err)
  });
}

  switchTab(tab: 'best-seller' | 'all'): void {

  this.currentTab = tab;
  this.currentPage = 1;

  const keyword = (this.route.snapshot.queryParamMap.get('keyword') || '').trim();

  this.applyGlobalFilter(keyword);
}

  updatePagination(): void {
    if (this.currentTab === 'best-seller') {
      // Tab sách bán chạy hiển thị danh sách ngắn cố định 5 quyển, không cần phân trang
      this.products = [...this.filteredProducts];
      this.totalPages = 1;
      this.pagesArray = [];
      return;
    }

    // Tính toán tổng số trang cho tab Tất cả sách (Mỗi trang 10 quyển)
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize) || 1;
    
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    // Cắt mảng lấy đúng số lượng sản phẩm của trang hiện tại (Tối đa 10 quyển)
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.products = this.filteredProducts.slice(startIndex, endIndex);

    // Xây dựng mảng số trang hiển thị thông minh dạng [1, 2, '...', 10]
    this.generatePageLabels();
  }

  generatePageLabels(): void {
    const pages: (number | string)[] = [];
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1); // Luôn luôn hiện trang đầu tiên

      if (current > 4) {
        pages.push('...');
      }

      const start = Math.max(2, current - 2);
      const end = Math.min(total - 1, current + 2);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - 3) {
        pages.push('...');
      }

      pages.push(total); // Luôn luôn hiện trang cuối cùng
    }

    this.pagesArray = pages;
  }

  goToPage(page: number | string): void {
    if (page === '...' || page === this.currentPage) {
      return;
    }
    this.currentPage = page as number;
    this.updatePagination();
    window.scrollTo({ top: 350, behavior: 'smooth' }); // Cuộn nhẹ lên đầu danh sách khi chuyển trang
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  // ==========================================
  // XỬ LÝ SỐ LƯỢNG CỦA Ô NHẬP & GIỎ HÀNG
  // ==========================================
  increaseQuantity(productId: number): void {
    this.quantities[productId]++;
  }

  decreaseQuantity(productId: number): void {
    if (this.quantities[productId] > 1) {
      this.quantities[productId]--;
    }
  }

  onQuantityChange(productId: number, event: any): void {
    let val = parseInt(event.target.value, 10);
    if (isNaN(val) || val < 1) {
      val = 1;
    }
    this.quantities[productId] = val;
  }

  onlyPositiveNumber(event: KeyboardEvent): void {
  const key = event.key;

  // Chỉ cho phép 1-9
  if (!/^[1-9]$/.test(key)) {
    event.preventDefault();
  }
}
  
  addToCart(product: Product): void {

  const quantity = Number(
    this.quantities[product.product_id]
  );

  if (
    isNaN(quantity) ||
    quantity < 1  
  ) {

    Swal.fire({
      toast: true,
      position: 'top-end',

      icon: 'warning',

      title: 'Số lượng không hợp lệ',

      showConfirmButton: false,

      timer: 2000
    });

    this.quantities[product.product_id] = 1;
    this.ctx.detectChanges();

    return;
  }

  this.cartService
    .addToCart(
      product.product_id,
      quantity
    )
    .subscribe({

      next: () => {

        this.quantities = {
          ...this.quantities,
          [product.product_id]: 1
        };

        this.ctx.detectChanges();

        Swal.fire({
          toast: true,
          position: 'top-end',

          icon: 'success',

          title:
            `Đã thêm ${quantity} "${product.title}" vào giỏ hàng`,

          showConfirmButton: false,

          timer: 2000,
          timerProgressBar: true
        });

      },

      error: (err) => {

        console.error(
          'ADD CART ERROR:',
          err
        );

        Swal.fire({
          toast: true,
          position: 'top-end',

          icon: 'error',

          title: 'Không thể thêm vào giỏ hàng',

          showConfirmButton: false,

          timer: 1500
        });

      }

    });

}

  buyNow(product: Product): void {

  const quantity = Number(
    this.quantities[product.product_id]
  );

  if (
    isNaN(quantity) ||
    quantity < 1
  ) {

    Swal.fire({
      toast: true,
      position: 'top-end',

      icon: 'warning',

      title: 'Số lượng không hợp lệ',

      showConfirmButton: false,

      timer: 2000
    });

    this.quantities[product.product_id] = 1;
    this.ctx.detectChanges();

    return;
  }

  const buyNowData = {
    product: JSON.parse(JSON.stringify(product)),
    quantity: quantity
  };

  this.cartService.setBuyNowItem(buyNowData);

  this.router.navigate(['/checkout']);
}

 searchByPrice(): void {

  const min = this.minPrice ?? 0;
  const max = this.maxPrice ?? Number.MAX_SAFE_INTEGER;

  // Không cho nhập số âm
  if (min < 0 || max < 0) {
    alert('Giá phải lớn hơn hoặc bằng 0');
    return;
  }

  // Không cho Giá từ lớn hơn Giá đến
  if (min > max) {
    alert('Giá từ phải nhỏ hơn hoặc bằng Giá đến');
    return;
  }

  this.productService
    .filterProductsByPrice(min, max)
    .subscribe({

      next: (res: Product[]) => {

  let result = [...res];

  if (this.authorKeyword.trim()) {
    result = result.filter(p =>
      p.author?.toLowerCase().includes(this.authorKeyword.toLowerCase().trim())
    );
  }

  if (this.titleKeyword.trim()) {
    result = result.filter(p =>
      p.title?.toLowerCase().includes(this.titleKeyword.toLowerCase().trim())
    );
  }

  this.filteredProducts = result;
  this.currentPage = 1;

  setTimeout(() => {
    this.updatePagination();
    this.ctx.detectChanges();
  });

},

      error: (err) => {
        console.error(err);
      }

    });

}

}

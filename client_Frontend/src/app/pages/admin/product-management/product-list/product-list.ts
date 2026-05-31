import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product-service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css', '../../admin-common.css'],
})
export class ProductList implements OnInit {
  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
  ) {}

  books: Product[] = [];
  filteredBooks: Product[] = [];

  searchTerm = '';

  currentPage = 1;
  itemsPerPage = 5;

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.books = data;
        this.filteredBooks = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải danh sách sách:', err);
      },
    });
  }

  searchBooks(): void {
    const keyword = this.searchTerm.toLowerCase().trim();

    if (!keyword) {
      this.filteredBooks = [...this.books];
    } else {
      this.filteredBooks = this.books.filter(
        (book) =>
          book.title?.toLowerCase().includes(keyword) ||
          book.author?.toLowerCase().includes(keyword) ||
          book.description?.toLowerCase().includes(keyword),
      );
    }

    this.currentPage = 1;
  }

  get pagedBooks(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredBooks.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredBooks.length / this.itemsPerPage) || 1;
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

  addBook(): void {
    alert('Chuyển đến form thêm sách');
  }

  editBook(id: number): void {
    alert(`Sửa sách ID: ${id}`);
  }

  deleteBook(id: number): void {
    const confirmed = confirm('Bạn có chắc muốn xóa sách này không?');

    if (!confirmed) {
      return;
    }

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.books = this.books.filter((book) => book.product_id !== id);

        this.filteredBooks = this.filteredBooks.filter((book) => book.product_id !== id);

        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }

        alert('Xóa sách thành công');
        this.loadBooks();
      },
      error: (err) => {
        console.error(err);
        alert('Xóa sách thất bại');
      },
    });
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../../core/services/product-service';
import { Product } from '../../../../core/models/product.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-edit-product',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css',
})
export class EditProduct {
  @Input() product!: Product;
  @Output() productUpdated = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
  ) {}
  productForm!: FormGroup;
  selectedFile: File | null = null;
  ngOnInit(): void {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      sold: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(1)]],
      publisher: ['', Validators.required],
      author: ['', Validators.required],
      cover_type: ['', Validators.required],
      description: [''],
      image: [null],
    });
    if (this.product) {
      this.productForm.patchValue({
        title: this.product.title,
        sold: this.product.sold,
        price: this.product.price,
        publisher: this.product.publisher,
        author: this.product.author,
        cover_type: this.product.cover_type,
        description: this.product.description,
      });
    }
  }
  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('title', this.productForm.value.title);
    formData.append('sold', this.productForm.value.sold);
    formData.append('price', this.productForm.value.price);
    formData.append('publisher', this.productForm.value.publisher);
    formData.append('author', this.productForm.value.author);
    formData.append('cover_type', this.productForm.value.cover_type);
    formData.append('description', this.productForm.value.description);

    if (this.selectedFile) {
      // Có chọn ảnh mới
      formData.append('image', this.selectedFile, this.selectedFile.name);
      console.log(this.selectedFile.name);
    } else {
      // Giữ ảnh cũ
      formData.append('oldImage', this.product.image);
    }

    this.productService.updateProduct(this.product.product_id, formData).subscribe({
      next: (res) => {
        alert('Cập nhật thành công');
        this.productUpdated.emit(res);
      },
      error: (err) => {
        console.error(err);
        alert('Cập nhật thất bại');
      },
    });
  }
  onCancel(): void {
    this.cancel.emit();
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.productForm.patchValue({
        image: this.selectedFile,
      });
    }
  }
}

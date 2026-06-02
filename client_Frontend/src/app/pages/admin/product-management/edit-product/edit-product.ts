import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../../core/services/product-service';
import { Product } from '../../../../core/models/product.model';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-edit-product',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css',
})
export class EditProduct {
  @Output() productAdd = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
  ) {}
  productForm!: FormGroup;
  ngOnInit(): void {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      rating: [''],
      sold: [0],
      price: [0, Validators.required],
      publisher: [''],
      author: [''],
      cover_type: [''],
      description: [''],
      image: [''],
    });
  }
  onSubmit(): void {
    if (this.productForm.valid) {
      this.productService.createProduct(this.productForm.value).subscribe({
        next: (res: Product) => {
          this.productAdd.emit(res);
          this.productForm.reset();
        },
        error: (err) => {
          console.error('Lỗi thêm sách:', err);
        },
      });
    }
  }
  onCancel(): void {
    this.cancel.emit();
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../../core/services/product-service';
import { ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-add-product',
  imports: [ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct implements OnInit {
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
      sold: [0, Validators.required, Validators.pattern(/^\d+$/)],
      price: [0, Validators.required, Validators.pattern(/^\d+$/)],
      publisher: ['', Validators.required],
      author: ['', Validators.required],
      cover_type: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required],
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

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../../core/services/product-service';
import { ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../../../core/models/product.model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-add-product',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct implements OnInit {
  @Output() productAdd = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();
  selectedFile!: File;
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
  ) {}
  productForm!: FormGroup;
  ngOnInit(): void {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      sold: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(1)]],
      publisher: ['', Validators.required],
      author: ['', Validators.required],
      cover_type: ['', Validators.required],
      description: [''],
      image: [null, Validators.required],
    });
  }
  get title() {
    return this.productForm.get('title');
  }
  get sold() {
    return this.productForm.get('sold');
  }
  get price() {
    return this.productForm.get('price');
  }
  get publisher() {
    return this.productForm.get('publisher');
  }
  get author() {
    return this.productForm.get('author');
  }
  get cover_type() {
    return this.productForm.get('cover_type');
  }
  get description() {
    return this.productForm.get('description');
  }
  get image() {
    return this.productForm.get('image');
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    this.selectedFile = file;
    this.productForm.patchValue({
      image: file,
    });
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
      formData.append('image', this.selectedFile);
    }
    this.productService.createProduct(formData).subscribe({
      next: (res: any) => {
        alert(res.message);

        this.productAdd.emit(res.product);

        this.productForm.reset();

        this.selectedFile = null as any;
      },

      error: () => {
        alert('Thêm sách thất bại');
      },
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  getProducts() {
    return this.http.get<Product[]>(`/api/products`);
  }
  createProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(`/api/products`, formData);
  }
  deleteProduct(id: number) {
    return this.http.delete(`/api/products/${id}`);
  }
  updateProduct(id: number, product: Product) {
    return this.http.put<Product>(`/api/products/${id}`, product);
  }
}
// GET → Dùng để lấy dữ liệu từ server (ví dụ: lấy danh sách sách).
// HEAD → Giống GET nhưng chỉ lấy phần header của phản hồi, không lấy nội dung body. Thường dùng để kiểm tra tài nguyên có tồn tại hay không.
// JSONP → Một kỹ thuật đặc biệt để lấy dữ liệu JSON thông qua <script> nhằm vượt qua hạn chế CORS trong trình duyệt.
// OPTIONS → Dùng để hỏi server xem tài nguyên hỗ trợ những phương thức nào (GET, POST, PUT…). Thường dùng trong kiểm tra CORS.
// PATCH → Dùng để cập nhật một phần dữ liệu (ví dụ: chỉ sửa rating của sách).
// POST → Dùng để gửi dữ liệu mới lên server (ví dụ: thêm sách mới).
// PUT → Dùng để cập nhật toàn bộ dữ liệu của một tài nguyên (ví dụ: thay đổi toàn bộ thông tin sách).
// DELETE → Dùng để xóa một tài nguyên trên server (ví dụ: xóa sách theo product_id).
// REQUEST → Phương thức tổng quát, cho phép bạn tự định nghĩa loại request (ít dùng trực tiếp, thường là nền tảng hỗ trợ).

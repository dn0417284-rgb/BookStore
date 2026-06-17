import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  isLoading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Getter tiện dùng trong template
  get email() { return this.loginForm.get('email')!; }
  get password() { return this.loginForm.get('password')!; }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {

      console.log(
        'LOGIN RESPONSE:',
        JSON.stringify(res, null, 2)
      );

      this.isLoading = false;

      this.authService.saveLogin(res);

      // load lại giỏ hàng từ server
      this.cartService.loadCart();

      console.log(
        'TOKEN LOCAL:',
        localStorage.getItem('token')
      );

      const role = this.authService.getUserRole();

      if (role === 'admin') {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/']);
      }
    },

      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err?.error?.message ||
          'Đăng nhập thất bại. Vui lòng thử lại.';
      }
    });
  }
}
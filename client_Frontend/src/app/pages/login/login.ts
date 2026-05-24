import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginData = {
    email: '',
    password: ''
  };

  errorMessage: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  onLogin(): void {
    this.errorMessage = '';

    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Vui lòng điền đầy đủ Email và Mật khẩu!';
      return;
    }

    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert(`Chào mừng ${res.data.user.HoTen}`);
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));

          this.router.navigate(['/']);
        }
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Đăng nhập thất bại. Vui lòng thử lại!';
      }
    });
  }
}
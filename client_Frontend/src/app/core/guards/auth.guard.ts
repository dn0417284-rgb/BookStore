import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../core/services/auth';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  // ====================
  // CHƯA LOGIN → CHUYỂN LOGIN
  // ====================
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
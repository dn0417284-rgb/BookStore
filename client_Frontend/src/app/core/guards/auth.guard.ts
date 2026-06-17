import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../core/services/auth';

export const roleGuard = (roles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.getCurrentUser();

    if (!user || !user.role) {
      return router.createUrlTree(['/login']);
    }

    if (!roles.includes(user.role)) {
      return router.createUrlTree(['/']);
    }

    return true;
  };
};
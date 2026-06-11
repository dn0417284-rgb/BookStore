import {
  HttpInterceptorFn
} from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (
  req,
  next
) => {

  const token =
    localStorage.getItem('token');

  // Gắn JWT cho tất cả API bắt đầu bằng /api
  const isBackendApi =
    req.url.startsWith('/api');

  if (
    token &&
    isBackendApi
  ) {

    req = req.clone({

      setHeaders: {

        Authorization:
          `Bearer ${token}`

      }

    });

  }

  return next(req);

};
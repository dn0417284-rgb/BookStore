import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  // ====================
  // AUTH
  // ====================
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then(m => m.RegisterComponent),
  },

  // ====================
  // HOME
  // ====================
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then(m => m.Home),
  },

  // ====================
  // PRODUCT DETAIL
  // ====================
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./pages/product-detail/product-detail')
        .then(m => m.ProductDetail),
  },

  // ====================
  // USER AREA (AUTH REQUIRED)
  // ====================
  {
    path: 'cart',
    canActivate: [roleGuard(['user', 'admin'])],
    loadComponent: () =>
      import('./pages/cart/cart').then(m => m.Cart),
  },
  {
    path: 'checkout',
    canActivate: [roleGuard(['user', 'admin'])],
    loadComponent: () =>
      import('./pages/checkout/checkout').then(m => m.Checkout),
  },
  {
    path: 'orders',
    canActivate: [roleGuard(['user', 'admin'])],
    loadComponent: () =>
      import('./pages/orders/orders').then(m => m.Orders),
  },
  {
    path: 'orders/:id',
    canActivate: [roleGuard(['user', 'admin'])],
    loadComponent: () =>
      import('./pages/order-detail/order-detail')
        .then(m => m.OrderDetail),
  },
  {
    path: 'profile',
    canActivate: [roleGuard(['user', 'admin'])],
    loadComponent: () =>
      import('./pages/profile/profile').then(m => m.Profile),
  },
  {
    path: 'addresses',
    canActivate: [roleGuard(['user', 'admin'])],
    loadComponent: () =>
      import('./pages/profile/address-management/address-management')
        .then(m => m.AddressManagement),
  },

  // ====================
  // ADMIN (ONLY NESTED - CHUẨN)
  // ====================
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [

      {
        path: 'products',
        loadComponent: () =>
          import('./pages/admin/product-management/product-list/product-list')
            .then(m => m.ProductList),
      },
      {
        path: 'products/add',
        loadComponent: () =>
          import('./pages/admin/product-management/add-product/add-product')
            .then(m => m.AddProduct),
      },
      {
        path: 'products/edit/:id',
        loadComponent: () =>
          import('./pages/admin/product-management/edit-product/edit-product')
            .then(m => m.EditProduct),
      },

      {
        path: 'customers',
        loadComponent: () =>
          import('./pages/admin/customer-management/customer-list/customer-list')
            .then(m => m.CustomerList),
      },

      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/admin/order-management/order-management')
            .then(m => m.OrderManagement),
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./pages/admin/order-management/order-detail-admin/order-detail-admin')
            .then(m => m.OrderDetailAdmin),
      },

      // (OPTIONAL) admin home
      // {
      //   path: '',
      //   loadComponent: () =>
      //     import('./pages/admin/dashboard/dashboard')
      //       .then(m => m.Dashboard),
      // },
    ],
  },

  // ====================
  // NOT FOUND
  // ====================
  {
    path: '**',
    redirectTo: '',
  },
];
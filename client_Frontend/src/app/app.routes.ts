import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';

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
  // CART + CHECKOUT (USER LOGIN REQUIRED)
  // ====================
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/cart/cart').then(m => m.Cart),
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/checkout/checkout').then(m => m.Checkout),
  },

  // ====================
  // ORDERS (USER)
  // ====================
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/orders/orders').then(m => m.Orders),
  },
  {
    path: 'orders/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/order-detail/order-detail')
        .then(m => m.OrderDetail),
  },

  // ====================
  // PROFILE (USER LOGIN REQUIRED)
  // ====================
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile/profile').then(m => m.Profile),
  },
  {
    path: 'addresses',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile/address-management/address-management')
        .then(m => m.AddressManagement),
  },

  // ====================
  // ADMIN AREA
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
        path: 'orders',
        loadComponent: () =>
          import('./pages/admin/order-management/order-list/order-list')
            .then(m => m.OrderList),
      },

      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./pages/admin/order-management/order-detail/order-detail')
            .then(m => m.OrderDetail),
      },

      {
        path: 'customers',
        loadComponent: () =>
          import('./pages/admin/customer-management/customer-list/customer-list')
            .then(m => m.CustomerList),
      },

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

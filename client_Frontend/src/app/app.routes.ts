import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login')
        .then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register')
        .then(m => m.Register)
  },
  {
    path: 'admin',

    loadComponent: () =>
      import('./pages/admin/dashboard/dashboard')
        .then(m => m.Dashboard),

    canActivate: [adminGuard]
  },

  {
    path: 'admin/products',
    loadComponent: () =>
      import('./pages/admin/product-management/product-list/product-list')
        .then(m => m.ProductList),
    canActivate: [adminGuard]
  },

  {
    path: 'orders',
    loadComponent: () =>
      import('./pages/orders/orders')
        .then(m => m.Orders)
  },

  {
    path: 'admin/orders',
    loadComponent: () =>
      import('./pages/admin/order-management/order-management')
        .then(m => m.OrderManagement)
  },

  {
    path: 'admin/orders/:id',
    loadComponent: () =>
      import(
        './pages/admin/order-management/order-detail-admin/order-detail-admin'
      ).then(m => m.OrderDetailAdmin),
    canActivate: [adminGuard]
  },

  {
    path: 'orders/:id',
    loadComponent: () =>
      import('./pages/order-detail/order-detail')
        .then(m => m.OrderDetail)
  },

  
  {
    path: 'admin/products/add',
    loadComponent: () =>
      import('./pages/admin/product-management/add-product/add-product')
        .then(m => m.AddProduct),
    canActivate: [adminGuard]
  },

  {
    path: 'admin/products/edit/:id',
    loadComponent: () =>
      import('./pages/admin/product-management/edit-product/edit-product')
        .then(m => m.EditProduct),
    canActivate: [adminGuard]
  },

  {
    path: 'admin/customers',
    loadComponent: () =>
      import('./pages/admin/customer-management/customer-list/customer-list')
        .then(m => m.CustomerList),
    canActivate: [adminGuard]
  },

  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile')
        .then(m => m.Profile)
  },

  {
    path: '',

    loadComponent: () =>
      import('./pages/home/home')
        .then(m => m.Home)
  },

  {
    path: 'product/:id',

    loadComponent: () =>
      import('./pages/product-detail/product-detail')
        .then(m => m.ProductDetail)
  },

  {
    path: 'cart',

    loadComponent: () =>
      import('./pages/cart/cart')
        .then(m => m.Cart)
  },

  {
    path: 'checkout',

    loadComponent: () =>
      import('./pages/checkout/checkout')
        .then(m => m.Checkout)
  },

  {
    path: 'addresses',
    loadComponent: () =>
      import(
        './pages/profile/address-management/address-management'
      )
      .then(m => m.AddressManagement)
  }
];

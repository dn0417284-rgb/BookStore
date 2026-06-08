import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: 'admin',

    loadComponent: () => import('./pages/admin/dashboard/dashboard').then((m) => m.Dashboard),
  },

  {
    path: 'admin/products',
    loadComponent: () =>
      import('./pages/admin/product-management/product-list/product-list').then(
        (m) => m.ProductList,
      ),
  },

  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders').then((m) => m.Orders),
  },

  {
    path: 'orders/:id',
    loadComponent: () => import('./pages/order-detail/order-detail').then((m) => m.OrderDetail),
  },

  {
    path: 'admin/customers',
    loadComponent: () =>
      import('./pages/admin/customer-management/customer-list/customer-list').then(
        (m) => m.CustomerList,
      ),
  },
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },

  {
    path: 'product/:id',

    loadComponent: () =>
      import('./pages/product-detail/product-detail').then((m) => m.ProductDetail),
  },

  {
    path: 'cart',

    loadComponent: () => import('./pages/cart/cart').then((m) => m.Cart),
  },

  {
    path: 'checkout',

    loadComponent: () => import('./pages/checkout/checkout').then((m) => m.Checkout),
  },

  {
    path: 'addresses',
    loadComponent: () =>
      import('./pages/profile/address-management/address-management').then(
        (m) => m.AddressManagement,
      ),
  },
];

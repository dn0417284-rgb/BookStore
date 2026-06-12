import { Routes } from '@angular/router';
//import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },

  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },

  // USER

  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart').then((m) => m.Cart),
  },

  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout').then((m) => m.Checkout),
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
    path: 'addresses',
    loadComponent: () =>
      import('./pages/profile/address-management/address-management').then(
        (m) => m.AddressManagement,
      ),
  },

  // ADMIN

  {
    path: 'admin/products',
    loadComponent: () =>
      import('./pages/admin/product-management/product-list/product-list').then(
        (m) => m.ProductList,
      ),

    //canActivate: [adminGuard],
  },

  {
    path: 'admin/products/add',
    loadComponent: () =>
      import('./pages/admin/product-management/add-product/add-product').then((m) => m.AddProduct),

    //canActivate: [adminGuard],
  },

  {
    path: 'admin/products/edit/:id',
    loadComponent: () =>
      import('./pages/admin/product-management/edit-product/edit-product').then(
        (m) => m.EditProduct,
      ),

    //canActivate: [adminGuard],
  },

  {
    path: 'admin/customers',
    loadComponent: () =>
      import('./pages/admin/customer-management/customer-list/customer-list').then(
        (m) => m.CustomerList,
      ),

    //canActivate: [adminGuard],
  },

  {
    path: 'admin/orders',
    loadComponent: () =>
      import('./pages/admin/order-management/order-list/order-list').then((m) => m.OrderList),

    //canActivate: [adminGuard],
  },
  {
    path: 'admin/orders/:id',
    loadComponent: () =>
      import('./pages/admin/order-management/order-detail/order-detail').then((m) => m.OrderDetail),

    //canActivate: [adminGuard],
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
];

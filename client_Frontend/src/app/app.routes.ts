import { Routes } from '@angular/router';
import { CustomerList } from './pages/admin/customer-management/customer-list/customer-list';
import { ProductList } from './pages/admin/product-management/product-list/product-list';
export const routes: Routes = [
  {
    path: 'customer',
    component: CustomerList,
  },
  { path: '', component: ProductList },
];

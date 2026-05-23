import { Routes } from '@angular/router';
import { CustomerList } from './pages/admin/customer-management/customer-list/customer-list';

export const routes: Routes = [
  {
    path: 'admin/customers',
    component: CustomerList,
  },
];

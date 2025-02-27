import { Routes } from '@angular/router';
import { isAdminGuard } from '../guard/admin-guard';
import { DashboardComponent } from '../components/pages/admin/dashboard/dashboard.component';
import { NewCategoryComponent } from '../components/pages/admin/category/new-category/new-category.component';
import { ListCategoryComponent } from '../components/pages/admin/category/list-category/list-category.component';
import { NewProductComponent } from '../components/pages/admin/product/new-product/new-product.component';
import { ListProductComponent } from '../components/pages/admin/product/list-product/list-product.component';
import { ListDiscountComponent } from '../components/pages/admin/discount/list-discount/list-discount.component';
import { NewDiscountComponent } from '../components/pages/admin/discount/new-discount/new-discount.component';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [isAdminGuard],
            },
            {
                path: 'newCategory',
                component: NewCategoryComponent,
                canActivate: [isAdminGuard],
            },
            {
                path: 'listCategory',
                component: ListCategoryComponent,
                canActivate: [isAdminGuard],
            },
            {
                path: 'newProduct',
                component: NewProductComponent,
                canActivate: [isAdminGuard],
            },
            {
                path: 'listProduct',
                component: ListProductComponent,
                canActivate: [isAdminGuard],
            },
            {
                path: 'listDiscount',
                component: ListDiscountComponent,
                canActivate: [isAdminGuard],
            },
            {
                path: 'newDiscount',   
                component: NewDiscountComponent,
                canActivate: [isAdminGuard],
            },

            { path: '', redirectTo: 'admin', pathMatch: 'full' },
            { path: '**', redirectTo: 'admin' },
        ],
    },
];
import { Routes } from '@angular/router';
import { RegisterComponent } from './components/pages/register/register.component';
import { LoginComponent } from './components/pages/login/login.component';
import { notAuthGuard } from './guard/not-auth-guard';
import { HomeComponent } from './components/pages/home/home.component';
import { authGuard } from './guard/auth-guard';
import { isAdminGuard } from './guard/admin-guard';
import { AdminContentComponent } from './components/pages/admin/admin-content/admin-content.component';
import { DetailProductComponent } from './components/pages/detail-product/detail-product.component';

export const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: HomeComponent, canActivate: [notAuthGuard]},
    { path: 'product/:id', component: DetailProductComponent},
    { path: 'register', component: RegisterComponent, canActivate: [notAuthGuard]},
    { path: 'login', component: LoginComponent, canActivate: [notAuthGuard]},
    {
        path: 'admin', component: AdminContentComponent, canActivate: [authGuard, isAdminGuard],
        loadChildren: () => import('./modules/admin-router.module').then(m => m.routes)
    },
    { path: '**', component: HomeComponent }
];

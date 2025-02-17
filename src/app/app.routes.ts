import { Routes } from '@angular/router';
import { RegisterComponent } from './components/pages/register/register.component';
import { LoginComponent } from './components/pages/login/login.component';
import { notAuthGuard } from './guard/not-auth-guard';
import { HomeComponent } from './components/pages/home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: HomeComponent, canActivate: [notAuthGuard]},
    { path: 'register', component: RegisterComponent, canActivate: [notAuthGuard]},
    { path: 'login', component: LoginComponent, canActivate: [notAuthGuard]},
    { path: '**', component: HomeComponent }
];

import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Login } from './components/login/login';
import { PageNotFound } from './components/page-not-found/page-not-found';
import { Signup } from './components/signup/signup';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },

    { path: 'login', component: Login, canActivate: [guestGuard] },
    { path: 'signup', component: Signup, canActivate: [guestGuard] },

    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', component: PageNotFound },
];

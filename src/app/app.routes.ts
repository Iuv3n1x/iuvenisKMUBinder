import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Login } from './components/login/login';
import { PageNotFound } from './components/page-not-found/page-not-found';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';
import { Settings } from './components/settings/settings';
import { AdminSignUp } from './components/admin/admin-sign-up/admin-sign-up';

export const routes: Routes = [
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },

    { path: 'login', component: Login, canActivate: [guestGuard] },
    { path: 'signup', component: Login, canActivate: [guestGuard] },

    { path: 'adminLogin', component: AdminSignUp, canActivate: [guestGuard] },
    { path: 'adminSetUp', component: AdminSignUp, canActivate: [guestGuard] },

    { path: 'settings', component: Settings, canActivate: [authGuard] },

    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', component: PageNotFound },
];

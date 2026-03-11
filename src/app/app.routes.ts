import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Login } from './components/login/login';
import { PageNotFound } from './components/page-not-found/page-not-found';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';
import { Settings } from './components/settings/settings';

export const routes: Routes = [
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },

    { path: 'login', component: Login, canActivate: [guestGuard] },
    { path: 'signup', component: Login, canActivate: [guestGuard] },

    { path: 'settings', component: Settings, canActivate: [authGuard] },

    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', component: PageNotFound },
];

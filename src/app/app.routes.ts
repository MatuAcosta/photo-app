import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { UploadComponent } from './images/upload/upload.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path:'home',
        title:'PicTopic',
        loadComponent() {
            return import('./home/home.component').then(m => m.HomeComponent);
        },
    },
    {
        path:'sign-up',
        title:'PicTopic',
        loadComponent() {
            return import('./auth/auth.component').then(m => m.AuthComponent);
        },
    },
    {
        path:'sign-in',
        title:'PicTopic',
        loadComponent() {
            return import('./auth/auth.component').then(m => m.AuthComponent);
        },
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path:'upload',
        title:'PicTopic',
        loadComponent() {
            return import('./images/upload/upload.component').then(m => m.UploadComponent);
        },
    }
];

import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { UploadComponent } from './images/upload/upload.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path:'home',
        component: HomeComponent,
    },
    {
        path:'sign-up',
        title:'auth',
        component: AuthComponent
    },
    {
        path:'sign-in',
        title:'auth',
        component: AuthComponent
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path:'upload',
        component: UploadComponent,
        canActivate: [authGuard]
    }
];

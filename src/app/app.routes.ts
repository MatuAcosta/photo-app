import { Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
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
        title:'Sign Up',
        component: SignupComponent
    },
    {
        path: 'sign-in',
        title: 'Sign in',
        component: SigninComponent
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

import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { UserAuth } from '../models/types';


export const authGuard: CanActivateFn = async (route, state) => {
  const authService: AuthService = inject(AuthService);
  let auth: boolean = false;
  let sub = authService.userAuth$.subscribe((userAuth: UserAuth | null) => { 
    auth = userAuth ? true : false;
  });
  sub.unsubscribe();
  return auth;
};

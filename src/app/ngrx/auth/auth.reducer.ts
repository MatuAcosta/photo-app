import { createReducer, on } from '@ngrx/store';
import { login, logout } from './auth.actions';

export interface AuthState {
  logged: boolean;
}

export const initialState: AuthState = {
  logged: false
};

export const authReducer = createReducer(
  initialState,
  on(login, (state) => ({ ...state, logged: true })),
  on(logout, (state) => ({ ...state, logged: false }))
);
export const selectAuth = (state: any) => state.auth;

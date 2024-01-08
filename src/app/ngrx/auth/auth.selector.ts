import { createFeatureSelector, createSelector } from "@ngrx/store";

export const selectAuth = createFeatureSelector<any>("auth");

export const selectAuthLogged = createSelector(
  selectAuth,
  (state: any) => state.logged
);
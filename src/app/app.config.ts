import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {getStorage, provideStorage} from '@angular/fire/storage';
import { provideAnimations } from '@angular/platform-browser/animations'
import { getFunctions, provideFunctions} from '@angular/fire/functions';
import { provideStore } from '@ngrx/store';
import { authReducer } from './ngrx/auth/auth.reducer';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(),
    importProvidersFrom(provideFirebaseApp(() => 
    initializeApp({ 
      "projectId": environment.projectId, 
      "appId": environment.appId,
      "storageBucket": environment.storageBucket, 
      "apiKey": environment.apiKey, 
      "authDomain": environment.authDomain, 
      "messagingSenderId": environment.messagingSenderId, 
      "measurementId": environment.measurementId 
    }))),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideStorage(() => getStorage())),
    importProvidersFrom(provideFunctions(() => getFunctions())),
    provideAnimations(), provideStore(
      {
        auth: authReducer
      }
    )],
};

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

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(),
    importProvidersFrom(provideFirebaseApp(() => initializeApp({ "projectId": "photo-app-cbdeb", "appId": "1:563996376380:web:64782452c5e52634d87239", "storageBucket": "photo-app-cbdeb.appspot.com", "apiKey": "AIzaSyALy3ifVcCWtUbAqAS766EqjIu7D7qEBHk", "authDomain": "photo-app-cbdeb.firebaseapp.com", "messagingSenderId": "563996376380", "measurementId": "G-DFX574X7K9" }))),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideStorage(() => getStorage())),
    importProvidersFrom(provideFunctions(() => getFunctions())), 
    provideAnimations(),
  ],
};

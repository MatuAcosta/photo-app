import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, User, signInWithEmailAndPassword, signInWithPopup } from '@angular/fire/auth';
import { UserCredential, createUserWithEmailAndPassword } from '@firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResponseGeneric, UserAuth } from '../models/types';
import { UserService } from './user.service';
import { FirebaseError } from '@angular/fire/app';
import { ErrorFirebase } from '../utils/error';
import { LoadingService } from './loading.service';
import  CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
  
})
export class AuthService {
  private authFirebase: Auth = inject(Auth);
  private userAuth: BehaviorSubject<UserAuth | null > = new BehaviorSubject<UserAuth | null > (null);
  private userService: UserService = inject(UserService);
  private loadingService: any = inject(LoadingService);
  public userAuth$: Observable<UserAuth | null> = this.userAuth.asObservable() ;
  
  constructor() { }

  verifyAuth(){    
    const unsuscribe = 
    this.authFirebase.onAuthStateChanged((user: User | null) => {
      //console.log('user', user);
      if(user){
        this.userAuth.next({
          email: user.email,
          accessToken: this.getToken(user)
        })
        this.setUser(String(user.email));
      } else{
        this.userAuth.next(null);
      }
      unsuscribe();
    })
  }

  async verifyUsername(username:string) {
    return await this.userService.findUserByUserName(username);
  }

  encryptPassword(password: string){
    let newPass = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(password), environment.encryptKey).toString()
    return newPass;
  }

  async signUp(email: string, password: string, username:string){
    let { error , message, user} = await this.verifyUsername(username);
    if(user) return {error: true, message};
    if (error) return {error, message};
    //password = this.encryptPassword(password)
    return createUserWithEmailAndPassword(this.authFirebase, email, password)
    .then(async (userCredential: UserCredential) => {
      try {
        await this.userService.createUser(email, username);
        let accessToken = await this.getToken((userCredential.user))
        this.setAuthUser({
          email: userCredential.user.email, 
          accessToken
        })
        this.setUser(email);
        return {
          error: false,
          message: 'Register Successfully'
        }
      } catch (error) {
        throw Error();
      }
    })
    .catch((error: FirebaseError) => {
      //console.log(error);
      return {
        error: true,
        message: ErrorFirebase[error.code as keyof typeof ErrorFirebase]
      }; 
    });
  }

  async signIn(email:string, password:string) : Promise<ResponseGeneric>{
    //password = this.encryptPassword(password)
    return signInWithEmailAndPassword(this.authFirebase, email, password)
    .then(async (userCredential: UserCredential) => {
      let accessToken = await this.getToken((userCredential.user))
      this.setAuthUser({
        email: userCredential.user.email, 
        accessToken
      })
      this.setUser(email);
      return {
        error: false,
        message: 'Login Successfully'
      }
    })
    .catch((error: FirebaseError) => {
    console.log('error login', error);
      return { 
        error: true,
        message: ErrorFirebase[error.code as keyof typeof ErrorFirebase]
      }
    });
  }


  async signInWithGoogle() : Promise<ResponseGeneric>{
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.authFirebase, provider)
    .then(async (userCredential: UserCredential) => {
      let userExists = await this.userService.findUserByEmail(String(userCredential.user.email));
      if(!userExists.user) {
        try {
          await this.userService.createUser(String(userCredential.user.email), String(userCredential.user.displayName));
        } catch (error: any) {
          return error;
        }
      }
      let accessToken = await this.getToken((userCredential.user))
      this.setAuthUser({
        email: userCredential.user.email, 
        accessToken
      })
      this.setUser(String(userCredential.user.email));
      return {
        error: false,
        message: 'Login Successfully'
      }
    })
    .catch((error: FirebaseError) => {
      console.log('error signInWithGoogle', error);
      return {
        error: true,
        message: ErrorFirebase[error.code as keyof typeof ErrorFirebase]
      }
    }); 

  }

  setAuthUser(user: UserAuth){
    this.userAuth.next(user);
  }

  setUser(email: string){
    this.userService.setUserDTO(email);
  }

  async logout(){
    this.userAuth.next(null);
    this.userService.cleanUserDTO();
    this.loadingService.setisLoading(true);
    await this.authFirebase.signOut();
    this.loadingService.setisLoading(false);
    return;
  }


  async getToken(user: User) {
    return await user.getIdToken();
}

}

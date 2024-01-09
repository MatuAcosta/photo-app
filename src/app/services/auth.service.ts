import { Injectable, inject } from '@angular/core';
import { Auth, User, signInWithEmailAndPassword } from '@angular/fire/auth';
import { UserCredential, createUserWithEmailAndPassword } from '@firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResponseGeneric, UserAuth } from '../models/types';
import { UserService } from './user.service';
import { FirebaseError } from '@angular/fire/app';
import { ErrorFirebase } from '../utils/error';
@Injectable({
  providedIn: 'root',
  
})
export class AuthService {
  private authFirebase: Auth = inject(Auth);
  private userAuth: BehaviorSubject<UserAuth | null > = new BehaviorSubject<UserAuth | null > (null);
  private userService: UserService = inject(UserService);
  public userAuth$: Observable<UserAuth | null> = this.userAuth.asObservable() ;
  
  constructor() { }

  async verifyUsername(username:string) {
    return await this.userService.findUserByUserName(username);
  }

  async signUp(email: string, password: string, username:string){
    let { error , message, user} = await this.verifyUsername(username);
    if(user) return {error: true, message};
    if (error) return {error, message};
    return createUserWithEmailAndPassword(this.authFirebase, email, password)
    .then(async (userCredential: UserCredential) => {
      let userCreated: UserAuth = {
        email: userCredential.user.email,
        accessToken: await this.getToken(userCredential.user) 
      }
      try {
        await this.userService.createUser(email, username);
        this.userAuth.next(userCreated);
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
      console.log(error);
      return {
        error: true,
        message: ErrorFirebase[error.code as keyof typeof ErrorFirebase]
      }; 
    });
  }

  async signIn(email:string, password:string) : Promise<ResponseGeneric>{
    return signInWithEmailAndPassword(this.authFirebase, email, password)
    .then(async (userCredential: UserCredential) => {
      let userLog: UserAuth = {
        email: userCredential.user.email,
        accessToken: await this.getToken(userCredential.user) 
      }
      this.userAuth.next(userLog);
      this.setUser(email);
      return {
        error: false,
        message: 'Login Successfully'
      }
    })
    .catch((error: FirebaseError) => {
      //console.log('error login', error);
      return { 
        error: true,
        message: ErrorFirebase[error.code as keyof typeof ErrorFirebase]
      }
    });
  }

  setUser(email: string){
    this.userService.setUserDTO(email);
  }

  async logout(){
    this.userAuth.next(null);
    this.userService.cleanUserDTO();
  }


  async getToken(user: User) {
    return await user.getIdToken();
}

}

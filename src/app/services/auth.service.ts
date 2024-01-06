import { Injectable, inject } from '@angular/core';
import { Auth, User, signInWithEmailAndPassword } from '@angular/fire/auth';
import { UserCredential, createUserWithEmailAndPassword } from '@firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResponseGeneric, UserAuth, UserDTO } from '../models/types';
import { UserService } from './user.service';
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
          message: 'User created'
        }
      } catch (error) {
        throw Error();
      }
    })
    .catch((error: any) => {
      console.log('error signup', error)
      return {
        error: true,
        message: error.message
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
        message: 'User logged'
      }
    })
    .catch((error) => {
      console.log('error login', error);
      return { 
        error: true,
        message: error.message
      }
    });
  }

  setUser(email: string){
    this.userService.setUserDTO(email);
  }

  async getToken(user: User) {
    return await user.getIdToken();
}

}

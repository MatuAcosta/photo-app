import { Injectable, inject } from '@angular/core';
import { Firestore, setDoc, getDoc, doc, query, collection, where, getDocs } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from '../models/types';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore: Firestore = inject(Firestore);
  private users_path: string = 'users';
  private userDTO: BehaviorSubject<UserDTO | null > = new BehaviorSubject<UserDTO | null > (null);
  public userDTO$: Observable<UserDTO | null> = this.userDTO.asObservable() ;

  constructor() { }
  

  cleanUserDTO(){
    this.userDTO.next(null);  
  }

  setUserDTO(email: string){
    this.findUserByEmail(email).then((res: any) => {
      if(res.error) return;
      if(res.user) this.userDTO.next(res.user);
    })
  }

  async findUserByEmail(email: string){
    const docRef = doc(this.firestore, this.users_path, email);    
    const q = query(collection(this.firestore, this.users_path), where('email', '==', email ));
    const querySnapshot = await getDocs(q);
    let user: UserDTO | null = null;
    querySnapshot.forEach((doc: any) => {
      user = doc.data();
    });
    return {
      error: false,
      message: 'User Exists',
      user
    }
  }


  async findUserByUserName(username: string){
    const docRef = doc(this.firestore, this.users_path, username);    
    try {
      const docSnap = await getDoc(docRef); 
      if(docSnap.exists()){
        return {
          error: false,
          message: 'Username exists',
          user: docSnap.data()
        }
      }
      return {
        error: false,
        message: 'User Not Exists',
        user: null
      }
    } catch (err: any) {
      console.log('error', err)
      return {
        error: true,
        message: err.message
      }
    }
  }

  async createUser(email: string, username: string){
    try {
      const createdUser = await setDoc(doc(this.firestore, this.users_path, username), 
      {
        email,
        username
      });
      return createdUser;
    } catch (error) {
      console.log('error createUser', error);
      return error;
    }
  }



}


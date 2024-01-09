import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { login, logout } from '../ngrx/auth/auth.actions';
import Toastify from 'toastify-js';
import { sign } from 'crypto';
import { PASSWORD_REGEXP, colorsToastify } from '../utils/constants';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
     CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private route = inject(Router);
  private store = inject(Store<any>);
  public isSignUp:boolean = false;

  public h2Text: string | undefined;
  public buttonText: string | undefined;


  constructor(){
    console.log(this.route.url);
    if(this.route.url === '/sign-up') this.isSignUp = true;
    if(this.isSignUp) this.addUserNameFormControl();
    this.h2Text = this.isSignUp ? 'Sign up to upload your photo' : 'Sign in to upload your photo';
    this.buttonText = this.isSignUp ? 'Sign up' : 'Sign in';
  }


  public signForm: any = this.fb.group({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.pattern(PASSWORD_REGEXP)]),
  });



  ngOnInit(){
    
  } 
  
  addUserNameFormControl(){
    return this.signForm.addControl('username', new FormControl<string>('', [Validators.required,Validators.minLength(6)]));
  }


  handleSubmit(e: SubmitEvent){
    if(this.isSignUp) return this.signUp(e);
    return this.signIn(e);
  }

  async signIn(e: SubmitEvent){
    e.preventDefault();
    if(!this.signForm.valid) return this.toastify('Email or password incorrect', true);
    const {email, password} = this.signForm.value;
    try {
      let signIn = await this.authService.signIn(String(email), String(password));
      if(signIn.error) throw new Error(signIn.message);
      console.log(signIn.message);
      this.navigateToHome();
      this.login();
      this.toastify(signIn.message);
    } catch (error: any) {
      this.toastify(error.message, true);

    }

  }

  async signUp(e: SubmitEvent){
    e.preventDefault();
    if(this.signForm.controls.password.invalid) return this.toastify('Password should be at least 6 characters, contain one number, one uppercase and one lowercase at least', true);
    if(!this.signForm.valid) return this.toastify('Email or password incorrect', true);
    
    const {email, password, username} = this.signForm.value;
    try {
      let signUp = await this.authService.signUp(String(email), String(password), String(username));
      if(signUp.error) throw new Error(signUp.message);
      console.log(signUp.message);
      this.navigateToHome();
      this.login();
      this.toastify(signUp.message);
    } catch (error: any) {
      this.toastify(error.message, true);
    }
  }

  toastify(text: string, error?: boolean){
    return Toastify({
      text,
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: error ? `linear-gradient(to right,${colorsToastify.error[0]},${colorsToastify.error[1]})` 
        : `linear-gradient(to right, ${colorsToastify.success[0]}, ${colorsToastify.success[1]})`
      },
      onClick: function(){} // Callback after click
    }).showToast();
  }

  login(){
    this.store.dispatch(login());
  }
  logout(){
    this.store.dispatch(logout());
  }

  navigateToHome(){
    this.route.navigate(['/']);
  }

}

import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private route = inject(Router)
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
    password: new FormControl<string>('', [Validators.required,Validators.minLength(6)]),
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
    if(!this.signForm.valid) return console.log('Not valid form');
    const {email, password} = this.signForm.value;
    try {
      let signIn = await this.authService.signIn(String(email), String(password));
      if(signIn.error) return console.log('Error signup', signIn.message);
      console.log(signIn.message);
      this.navigateToHome();

    } catch (error) {
      console.log(error);
    }

  }

  async signUp(e: SubmitEvent){
    e.preventDefault();
    if(!this.signForm.valid) return console.log('Not valid form');
    const {email, password, username} = this.signForm.value;
    try {
      let signUp = await this.authService.signUp(String(email), String(password), String(username));
      if(signUp.error) return console.log('Error signup', signUp.message);
      console.log(signUp.message);
      this.navigateToHome();
    } catch (error) {
      console.log(error);
    }

  }
  navigateToHome(){
    this.route.navigate(['/']);
  }

}

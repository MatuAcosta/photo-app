import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  public signForm = this.fb.group({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required,Validators.minLength(6)]),
    username:  new FormControl<string>('', [Validators.required,Validators.minLength(6)])
  });
  
  ngOnInit(){
  } 
  
  async signUp(e: SubmitEvent){
    e.preventDefault();
    if(!this.signForm.valid) return console.log('Not valid form');
    const {email, password, username} = this.signForm.value;
    try {
      let signUp = await this.authService.signUp(String(email), String(password), String(username));
      if(signUp.error) return console.log('Error signup', signUp.message);
      console.log(signUp.message);
    } catch (error) {
      console.log(error);
    }

  }
}

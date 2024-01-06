import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: '../signup/signup.component.css'
})
export class SigninComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  public signForm = this.fb.group({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required,Validators.minLength(6)]),
  });
  
  ngOnInit(){
  } 
  
  async signIn(e: SubmitEvent){
    e.preventDefault();
    if(!this.signForm.valid) return console.log('Not valid form');
    const {email, password} = this.signForm.value;
    try {
      let signIn = await this.authService.signIn(String(email), String(password));
      if(signIn.error) return console.log('Error signup', signIn.message);
      console.log(signIn.message);
    } catch (error) {
      console.log(error);
    }

  }
}

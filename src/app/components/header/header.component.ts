import { Component, Input, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { user } from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import { logout } from '../../ngrx/auth/auth.actions';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() logged: any;
  private store: Store<any> = inject(Store<any>);


  constructor() { 
    
  }
  ngOnInit(): void {
    console.log('logged', this.logged);
  }
  logout(){
    this.store.dispatch(logout());
  }

}

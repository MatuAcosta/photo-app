import { Component, Input, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from '../../ngrx/auth/auth.actions';
import Toastify from 'toastify-js';
import { colorsToastify } from '../../utils/constants';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() logged: any;
  private store: Store<any> = inject(Store<any>);
  public displayHeader: boolean = false;
  
  toggleHeader(){
    this.displayHeader = !this.displayHeader;
  }

  constructor() { 
    
  }
  ngOnInit(): void {
  }
  logout(){
    this.toastify('Logout success');
    this.store.dispatch(logout());
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
}

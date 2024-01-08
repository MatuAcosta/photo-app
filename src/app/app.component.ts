import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import {  RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AuthState } from './ngrx/auth/auth.reducer';
import { selectAuthLogged } from './ngrx/auth/auth.selector';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, HeaderComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'photo-app';
  private store: Store<any> = inject(Store<any>);
  public authLogged$: Observable<boolean> = this.store.pipe(select(selectAuthLogged));

  constructor(){
  }

  async ngOnInit(): Promise<any> {
  }
}

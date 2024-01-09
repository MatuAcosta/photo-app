import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import {  RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { selectAuthLogged } from './ngrx/auth/auth.selector';
import { DateService } from './services/date.service';
import { InstructionsModalComponent } from './instructions-modal/instructions-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InstructionsModalComponent,CommonModule, RouterOutlet, RouterLink, HeaderComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'photo-app';
  private store: Store<any> = inject(Store<any>);
  private dateService: DateService = inject(DateService);
  private platformId: any = inject(PLATFORM_ID);
  public authLogged$: Observable<boolean> = this.store.pipe(select(selectAuthLogged));
  public showModal: boolean = false;
  constructor(){
    if(this.platformId === 'browser' && localStorage.getItem('instructions') === null){
      localStorage.setItem('instructions', 'false');
      this.showModal = true;
    }
    if(this.platformId === 'browser' && localStorage.getItem('instructions') === 'false'){
      this.showModal = true;
    }
  }

  async ngOnInit(): Promise<any> {
    if (this.platformId === 'browser'){
      if (localStorage.getItem('date') !== this.dateService.todayDate.join('-')){
        localStorage.removeItem('usernameLikes')
        localStorage.setItem('date', this.dateService.todayDate.join('-'));
      }
    }
  }
  closeModal(event: any){
    if(this.platformId ==='browser'){
      localStorage.setItem('instructions', 'true');
    }
    this.showModal = false;
  }
}

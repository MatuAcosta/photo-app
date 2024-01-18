import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import {  RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { DateService } from './services/date.service';
import { InstructionsModalComponent } from './instructions-modal/instructions-modal.component';
import { AuthService } from './services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ AsyncPipe,FooterComponent, InstructionsModalComponent,CommonModule, RouterOutlet, RouterLink, HeaderComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'photo-app';
  private dateService: DateService = inject(DateService);
  private platformId: any = inject(PLATFORM_ID);
  public loadingService: LoadingService = inject(LoadingService);
  public authService: AuthService = inject(AuthService);
  public showModal: boolean = false;
  constructor(){
    if(this.platformId === 'browser' && localStorage.getItem('instructions') === null){
      localStorage.setItem('instructions', 'false');
      this.showModal = true;
    }
    if(this.platformId === 'browser' && localStorage.getItem('instructions') === 'false'){
      this.showModal = true;
    }
    this.authService.verifyAuth();
  }

  async ngOnInit(): Promise<any> {
    if (this.platformId === 'browser'){
      if (localStorage.getItem('date') !== this.dateService.todayDate.join('-')){
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

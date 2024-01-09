import { Component, OnInit, inject } from '@angular/core';
import { AlbumComponent } from '../images/album/album.component';
import { PictureService } from '../services/picture.service';
import { PictureDTO } from '../models/types';
import { TopicService } from '../services/topic.service';
import { DocumentData } from '@angular/fire/firestore';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AlbumComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private pictureService: PictureService = inject(PictureService);
  private topicService: TopicService = inject(TopicService);
  private destroy$ = new Subject<void>();

  public pictures: PictureDTO[] = [];
  public topicOfTheDay: DocumentData | undefined | null;
  
  constructor() { 
  }
  async ngOnInit() {
    this.pictureService.pictures$.pipe(takeUntil(this.destroy$)).subscribe((pictures: PictureDTO[]) => {
      this.pictures = pictures;
    });
    await this.getTopicOfTheDay();
    this.getPictures();
  }

  dateLocalStorage(){
    localStorage.setItem('date', JSON.stringify(this.topicOfTheDay?.['date']));
  }

  async getTopicOfTheDay(){
    try {
      await this.topicService.getTopicOfTheDay();
      if(this.topicService.topicOfTheDay){
        this.topicOfTheDay = this.topicService.topicOfTheDay;
      }
      console.log('topicOfTheDay', this.topicOfTheDay);
    } catch (error) {
      
    }
  }


  async getPictures(){
    try {
      await this.pictureService.getPictures();
    } catch (error) {
      console.log('error in getPictures', error);
    }
  }

  likePicture(event: any){
    this.pictureService.likePicture(event.username,  event.likes);
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

}

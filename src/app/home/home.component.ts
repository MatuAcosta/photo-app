import { Component, OnInit, inject } from '@angular/core';
import { AlbumComponent } from '../images/album/album.component';
import { PictureService } from '../services/picture.service';
import { PictureDTO } from '../models/types';
import { TopicService } from '../services/topic.service';
import { DocumentData } from '@angular/fire/firestore';
import { RouterLink } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';

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
  public noMorePictures: boolean = false;
  constructor() { }

  async ngOnInit() {
    this.pictureService.pictures$.pipe(takeUntil(this.destroy$)).subscribe((pictures: PictureDTO[]) => {
      this.pictures = pictures;
    });
    this.pictureService.noMorePictures$.pipe(takeUntil(this.destroy$)).subscribe((noMore: boolean) => {      
      this.noMorePictures = noMore;
    });
    await this.getTopicOfTheDay();
    this.getPictures();
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

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

}

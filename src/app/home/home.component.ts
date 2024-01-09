import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
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
  private platformId: any = inject(PLATFORM_ID);
  public usernameLikes: string[] = [];
  public pictures: PictureDTO[] = [];
  public topicOfTheDay: DocumentData | undefined | null;
  
  constructor() { 
    if(this.platformId === 'browser'){
      this.usernameLikes = JSON.parse(localStorage.getItem('usernameLikes') || '[]');
    }
  }
  async ngOnInit() {
    this.pictureService.pictures$.pipe(takeUntil(this.destroy$)).subscribe((pictures: PictureDTO[]) => {
      this.pictures = pictures;
    });
    await this.getTopicOfTheDay();
    this.getPictures();
  }

  dateLocalStorage(){
    if (this.platformId === 'browser'){
      localStorage.setItem('date', JSON.stringify(this.topicOfTheDay?.['date']));
    }

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


  indexLikes(){
    let copyUsername = JSON.parse(JSON.stringify(this.usernameLikes));
    let likesIndexed = copyUsername.reduce((acc: any, username: string) => {
      acc[username] = username;
      return acc
    }, {});
    return likesIndexed;
  }
  indexPictures(){
    let copyPictures = JSON.parse(JSON.stringify(this.pictures));
    let pcituresIndexed = copyPictures.reduce((acc: any, picture: PictureDTO) => {
      acc[picture.username] = picture;
      return acc
    }, {});
    return pcituresIndexed;
  }


  async getPictures(){
    try {
      await this.pictureService.getPictures();
    } catch (error) {
      console.log('error in getPictures', error);
    }
  }

  likePicture(event: any){
    let indexLikes = this.indexLikes();
    let indexPictures = this.indexPictures();
    if(indexLikes[event.username as keyof typeof indexLikes]){ 
       indexPictures[event.username as keyof typeof indexPictures].likes -= 1;
       this.usernameLikes = this.usernameLikes.filter(
        (username: string) => username !== event.username);
    } else {
      indexPictures[event.username as keyof typeof indexPictures].likes += 1;
      this.usernameLikes.push(event.username);
    }
    if(this.platformId === 'browser'){
      localStorage.setItem('usernameLikes', JSON.stringify(this.usernameLikes));
    }
    this.pictureService.likePicture(event.username,  event.likes);
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

}

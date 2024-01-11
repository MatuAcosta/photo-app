import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { AlbumComponent } from '../images/album/album.component';
import { PictureService } from '../services/picture.service';
import { PictureDTO } from '../models/types';
import { TopicService } from '../services/topic.service';
import { DocumentData } from '@angular/fire/firestore';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AlbumComponent, RouterLink, KeyValuePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private pictureService: PictureService = inject(PictureService);
  private topicService: TopicService = inject(TopicService);
  private destroy$ = new Subject<void>();
  private platformId: any = inject(PLATFORM_ID);
  public pictures: {[key: string]: PictureDTO} = {};
  public topicOfTheDay: DocumentData | undefined | null;
  
  constructor() { 
  }
  async ngOnInit() {
    this.pictureService.pictures$.pipe(takeUntil(this.destroy$)).subscribe((pictures: PictureDTO[]) => {
      this.pictures = this.indexPictures(pictures)
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
    } catch (error) {
      
    }
  }


  indexLikesOfAPicture(userLikes: string[]){
    let copyUsername = JSON.parse(JSON.stringify(userLikes));
    let likesIndexed = copyUsername.reduce((acc: any, username: string) => {
      acc[username] = username;
      return acc
    }, {});
    return likesIndexed;
  }
  /**
   * 
   * @param picturesArray 
   * @returns {[key: username]: PictureDTO} object of pictures indexed by username
   */
  indexPictures(picturesArray: PictureDTO[]){
    let pcituresIndexed = picturesArray.reduce((acc: any, picture: PictureDTO) => {
      acc[picture.username] = picture;
      return acc
    }, {});
    return pcituresIndexed;
  }


  async getPictures(){
    try {
      await this.pictureService.getPictures();
    } catch (error) {
      //console.log('error in getPictures', error);
    }
  }

  async likePicture(event: any){
    let pictureLikes = this.pictures[event.username as keyof typeof this.pictures].likes;
    let indexLikes = this.indexLikesOfAPicture(pictureLikes);
    if(indexLikes[event.username as keyof typeof indexLikes]){ 
      this.pictures[event.username as keyof typeof this.pictures].likes = pictureLikes.filter((username: string) => username !== event.username);
    } else {
      this.pictures[event.username as keyof typeof this.pictures].likes.push(event.username);
    }
    pictureLikes = this.pictures[event.username as keyof typeof this.pictures].likes;
    await this.pictureService.likePicture(event.username, pictureLikes);
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

}

import { Component, OnInit, inject } from '@angular/core';
import { AlbumComponent } from '../images/album/album.component';
import { PictureService } from '../services/picture.service';
import { PictureDTO, TopicDTO } from '../models/types';
import { DateService } from '../services/date.service';
import { TopicService } from '../services/topic.service';
import { DocumentData } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AlbumComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private pictureService: PictureService = inject(PictureService);
  private dateService: DateService = inject(DateService);
  private topicService: TopicService = inject(TopicService);
  public pictures: PictureDTO[] = [];
  public topicOfTheDay: DocumentData | undefined | null;
  constructor() { }

  async ngOnInit() {
    console.log(new Date().getTime());
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
      let picturesData = await this.pictureService.getPictures();
      this.pictures = picturesData.data;
    } catch (error) {
      console.log('error in getPictures', error);
    }

  }

}

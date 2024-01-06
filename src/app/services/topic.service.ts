import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { DateService } from './date.service';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private firestore: Firestore = inject(Firestore);
  private dateService: DateService = inject(DateService);
  private topicDb: string = 'topics';
  public topicOfTheDay: any;
  constructor() { }

  async getTopicOfTheDay(){
    console.log(this.dateService.todayDate.join('-'));
    
    const docRef = doc(this.firestore, this.topicDb, this.dateService.todayDate.join('-'));    
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
      this.topicOfTheDay = docSnap.data();
    }
  }

}
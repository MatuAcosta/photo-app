import { Injectable, inject } from '@angular/core';
import { DocumentData, Firestore, doc, getDoc,setDoc, updateDoc } from '@angular/fire/firestore';
import { DateService } from './date.service';
import { OpenaiService } from './openai.service';
import { BehaviorSubject } from 'rxjs';
import { TopicDTO } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private firestore: Firestore = inject(Firestore);
  private dateService: DateService = inject(DateService);
  private openAIService: OpenaiService = inject(OpenaiService);
  private topicDb: string = 'topics';
  private  _topicOfTheDay: BehaviorSubject<TopicDTO | any> = new BehaviorSubject<any>(null);
  constructor() { }

  async getTopicOfTheDay(){
    //console.log('getTopic');  
    const docRef = doc(this.firestore, this.topicDb, this.dateService.todayDate.join('-'));    
    const docSnap = await getDoc(docRef);
    let topic: TopicDTO | DocumentData | any;
    if(!docSnap.exists()){
      //console.log('topic1', topic)

      topic = await this.setTopicOfTheDay();    
    } else {
      //console.log('topic2', topic)
      topic  = docSnap.data();
    }
    this._topicOfTheDay.next(topic);
    //console.log('topic', topic)
  } 
  get topicOfTheDay(): TopicDTO | DocumentData | any {
    return this._topicOfTheDay.getValue();
  }

  
  async setTopicOfTheDay(){
    try {
      const topic: string = await this.openAIService.callOpenAITopic();
      const phrase: string = await this.openAIService.callOpenAI(topic);
      const createdTopic = await setDoc(doc(this.firestore, this.topicDb, this.dateService.todayDate.join('-')), 
      {
        date: this.dateService.todayDate.join('-'),
        topic,
        phrase
      });
      return {
        date: this.dateService.todayDate.join('-'),
        topic,
        phrase
      }
    } catch (error) {
      //console.log('error createUser', error);
      return error;
    }
  }


}
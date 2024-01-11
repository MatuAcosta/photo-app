import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  private http: HttpClient = inject(HttpClient);
  constructor() { }

  async callOpenAITopic(): Promise<string>{
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment.openAIKEY}`
    }

    return new Promise((resolve: any, reject: any) => {
      this.http.post<any>('https://api.openai.com/v1/chat/completions',{
        messages:[{
          role:'user',
          content: `Give me a normal topic, just 1 or 2 words`
        }],
        model: 'gpt-3.5-turbo'
      } ,{
        headers,
  
      }).pipe(catchError((err: any) => {
        console.log(err);
        return reject(err) 
      })).subscribe(
        (res: any) => {
        return resolve(res.choices[0].message.content);
      }
      )
    })


  }

  async callOpenAI(topic: string): Promise<string>{
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment.openAIKEY}`
    }

    return new Promise((resolve: any, reject: any) => {
      this.http.post<any>('https://api.openai.com/v1/chat/completions',{
        messages:[{
          role:'user',
          content: `Tell me an interesting fact about ${topic}, just 10 words`
        }],
        model: 'gpt-3.5-turbo'
      } ,{
        headers,
  
      }).pipe(catchError((err: any) => {
        console.log(err);
        return reject(err) 
      })).subscribe(
        (res: any) => {
          return resolve(res.choices[0].message.content);
        }
      )
    })


  }

}

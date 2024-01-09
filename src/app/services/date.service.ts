import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  public today: Date = new Date();
  public todayDate: string[] = [this.today.getFullYear().toString(), (this.today.getMonth() + 1).toString(), this.today.getDate().toString()]; // [year, month, day]
  
  constructor() { }
}

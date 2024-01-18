import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  
  private _isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoading$ = this._isLoading.asObservable();

  constructor() { }

  setisLoading(value: boolean) {
    this._isLoading.next(value);
  }

  get isLoading(): boolean {
    return this._isLoading.getValue();
  }

}

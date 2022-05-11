import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  _logs: string[] = [];
  logs: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])

  constructor() { }


  Log(val: string) {
    this._logs.push(val);
    this.logs.next(this._logs);
    console.log(val);
  }

}

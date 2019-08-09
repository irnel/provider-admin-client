import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  public currentDateSubject: BehaviorSubject<Date>;
  private currentDate: Observable<Date>;

  constructor() {
    this.currentDateSubject = new BehaviorSubject<Date>(new Date());
    this.currentDate = this.currentDateSubject.asObservable();
  }

  sendDate(date: Date) {
    this.currentDateSubject.next(date);
  }

  getCurrentDate() {
    return this.currentDateSubject.value;
  }
}

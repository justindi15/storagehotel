import { Component, Output, EventEmitter, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';
import { MatCalendar } from '@angular/material';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';


@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements AfterViewInit {
  @Output()
  dateSelected: EventEmitter<Moment> = new EventEmitter();
 
  @Output()
  selectedDate = moment();
 
  @ViewChild('calendar', {static: false})
  calendar: MatCalendar<Moment>
 
  today = new Date();
  time: string;

  constructor(private renderer: Renderer2, private checkout: CheckoutService) { 
  }

  ngAfterViewInit() {
    const buttons = document.querySelectorAll('.mat-calendar-previous-button, .mat-calendar-next-button');
 
    if (buttons) {
      Array.from(buttons).forEach(button => {
        this.renderer.listen(button, 'click', () => {
          console.log('Arrow buttons clicked');
        });
      });
    }

    if(this.checkout.date){
      this.calendar.selected = this.checkout.date;
      this.calendar.activeDate = this.checkout.date;
    }

    if(this.checkout.time){
      this.time = this.checkout.time;
    }
  }

  dateChanged() {
    this.calendar.activeDate = this.selectedDate;
    this.checkout.date = this.selectedDate;
    this.dateSelected.emit(this.selectedDate);
  }

  timeChanged() {
    this.checkout.time = this.time;
  }

}

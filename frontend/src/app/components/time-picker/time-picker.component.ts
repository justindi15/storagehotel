import { Component, Output, EventEmitter, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';
import { MatCalendar } from '@angular/material';

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
  calendar: MatCalendar<Moment>;
 
  today = new Date();

  constructor(private renderer: Renderer2) { }
 
  ngAfterViewInit() {
    const buttons = document.querySelectorAll('.mat-calendar-previous-button, .mat-calendar-next-button');
 
    if (buttons) {
      Array.from(buttons).forEach(button => {
        this.renderer.listen(button, 'click', () => {
          console.log('Arrow buttons clicked');
        });
      });
    }
  }

  dateChanged() {
    this.calendar.activeDate = this.selectedDate;
    this.dateSelected.emit(this.selectedDate);
  }

}

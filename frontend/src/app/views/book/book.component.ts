import { Component, OnInit, ViewChild } from '@angular/core';
import { Moment } from 'moment';
import { TimePickerComponent } from 'src/app/components/time-picker/time-picker.component';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  @ViewChild('calendar', {static: false})
  calendar: TimePickerComponent;

  constructor() { }

  ngOnInit() {
  }
 
  dateSelected(value: Moment) {
    console.log(value);
  }

}

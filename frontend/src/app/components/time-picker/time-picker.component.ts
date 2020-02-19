import { Component, AfterViewInit } from '@angular/core';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';
import { MatCalendarCellCssClasses } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

export interface PickupDate {
  value: Date,
  label: string,
}


@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements AfterViewInit {
 
  index: number;
  FreePickupDates: PickupDate[] = [
    {value: new Date(2020, 3, 1), label: 'April 1, 2020'},
    {value: new Date(2020, 3, 2), label: 'April 2, 2020'},
    {value: new Date(2020, 3, 3), label: 'April 3, 2020'},
    {value: new Date(2020, 3, 4), label: 'April 4, 2020'},
  ]
  preferredTimes = [
    '10:00am to 12:00pm',
    '1:00pm to 3:00pm',
    '4:00pm to 6:00pm',
    '7:00pm to 9:00pm',
  ]

  SupplyDropForm = new FormGroup({
    deliveryMethod: new FormControl('FREE', Validators.required),
    date: new FormControl('', Validators.required),
    preferredTime: new FormControl('', Validators.required),
  })

  PickupForm = new FormGroup({
    deliveryMethod: new FormControl('FREE', Validators.required),
    date: new FormControl('', Validators.required),
    preferredTime: new FormControl('', Validators.required),
  })

  constructor(private checkout: CheckoutService) { 
  }

  ngAfterViewInit() {
  }

  myFilter = (d: Date | null): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6 ;
  }

  onNext(){
    console.log(this.SupplyDropForm.value);
  }

}

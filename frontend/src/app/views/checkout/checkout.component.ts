import { Component, OnInit, ViewChild } from '@angular/core';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper'
import { CheckoutService } from 'src/app/services/checkout/checkout.service';
import { School, LatLng, SCHOOLS} from 'src/app/schools';
import { TimePickerComponent } from 'src/app/components/time-picker/time-picker.component'

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class CheckoutComponent implements OnInit {

  @ViewChild('TimePicker', {static: false}) private timePicker: TimePickerComponent;
  
  priceEstimate: number;
  confirmed: boolean = false;

  constructor(private checkoutService: CheckoutService) {
    this.checkoutService.currentpriceEstimate.subscribe(newpriceEstimate => this.priceEstimate = newpriceEstimate);
   }

  ngOnInit() {
  }

  onConfirm(event){
    if(event){
      this.timePicker.enable();
    }else{
      this.timePicker.reset();
    }
  }

  onGetSchool(school){
    this.timePicker.setFreePickupDates(school);
  }

}

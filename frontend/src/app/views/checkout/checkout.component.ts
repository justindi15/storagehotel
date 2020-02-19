import { Component, OnInit } from '@angular/core';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper'
import { CheckoutService } from 'src/app/services/checkout/checkout.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class CheckoutComponent implements OnInit {
  
  priceEstimate: number;

  constructor(private checkoutService: CheckoutService) {
    this.checkoutService.currentpriceEstimate.subscribe(newpriceEstimate => this.priceEstimate = newpriceEstimate);
   }

  ngOnInit() {
  }

}

import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper'
import { CheckoutService } from 'src/app/services/checkout/checkout.service';
import { School, LatLng, SCHOOLS} from 'src/app/schools';
import { TimePickerComponent } from 'src/app/components/time-picker/time-picker.component'
import { OrderCatalogComponent } from 'src/app/components/order-catalog/order-catalog.component'
import { PRODUCTS, storagebox } from 'src/app/products';
import { MatStepper, MatStep } from '@angular/material';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class CheckoutComponent implements OnInit {

  @ViewChild('timePicker', {static: false}) private timePicker: TimePickerComponent;
  @ViewChild(OrderCatalogComponent, {static: false}) private orderCatalog: OrderCatalogComponent;
  @ViewChild('stepper', {static: false}) stepper: MatStepper;
  @ViewChild('Book', {static: false}) book: MatStep;
  
  priceEstimate: number;
  confirmed: boolean = false;
  bookingCompleted: boolean = false;

  constructor(private checkoutService: CheckoutService) {
    this.checkoutService.currentpriceEstimate.subscribe(newpriceEstimate => this.priceEstimate = newpriceEstimate);
  }

  ngOnInit() {
  }

  onConfirmLocation(event){
    if(event){
      this.timePicker.enable();
    }else{
      this.timePicker.reset();
    }
  }

  onGetSchool(school){
    this.timePicker.setFreePickupDates(school);
  }

  removeItem(product){
    let productNames = PRODUCTS.map((product)=> product.name)
    productNames.push(storagebox.name)
    for(let i = 0; i < productNames.length; i++){
      if(product.name === productNames[i]){
        this.orderCatalog.decrementProduct(product);
        return;
      }
    }
    //else its a custom item
    for(let i=0; i < this.checkoutService.customItems.length; i++){
      if((this.checkoutService.customItems[i].name === product.name)){
        this.checkoutService.customItems.splice(i, 1);
      }
    }
    this.checkoutService.removeFromCart(product);
    this.checkoutService.decreasepriceEstimate(this.priceEstimate - product.price);
    if(this.checkoutService.counters[product.name] && this.checkoutService.counters[product.name] >= 1){
      this.checkoutService.counters[product.name]--
    }
    if(this.checkoutService.subscriptions[product.plan_id] && this.checkoutService.subscriptions[product.plan_id] >= 1){
      this.checkoutService.subscriptions[product.plan_id]--
    }
  }
}

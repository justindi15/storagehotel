import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';
import { product } from 'src/app/products';

@Component({
  selector: 'app-custom-item',
  templateUrl: './custom-item.component.html',
  styleUrls: ['./custom-item.component.css']
})
export class CustomItemComponent implements OnInit {

  totalCubicFeet: number = 0;
  priceEstimate: number;
  priceMultiplier = 3;
  CUBICFOOT = 12 * 12 * 12

  customItemForm = new FormGroup({
    name: new FormControl(''),
    length: new FormControl(''),
    width: new FormControl(''),
    height: new FormControl(''),
  })

  constructor( private checkoutService: CheckoutService ) { 
    this.checkoutService.currentpriceEstimate.subscribe(newpriceEstimate => this.priceEstimate = newpriceEstimate);
  }

  ngOnInit() {
    this.onChanges()
  }

  onChanges(): void {
    this.customItemForm.get('length').valueChanges.subscribe(val => {
      this.totalCubicFeet = Math.ceil((val * this.customItemForm.get('width').value * this.customItemForm.get('height').value) / this.CUBICFOOT)
    });

    this.customItemForm.get('width').valueChanges.subscribe(val => {
      this.totalCubicFeet = Math.ceil((val * this.customItemForm.get('length').value * this.customItemForm.get('height').value) / this.CUBICFOOT)
    });

    this.customItemForm.get('height').valueChanges.subscribe(val => {
      this.totalCubicFeet = Math.ceil((val * this.customItemForm.get('width').value * this.customItemForm.get('length').value) / this.CUBICFOOT)
    });
  }

  addItem(){
    let customProduct: product = {
      name: this.customItemForm.get('name').value + " (" + this.totalCubicFeet.toString() + " cu. ft)",
      plan_id: this.totalCubicFeet.toString(),
      col: '0',
      path: 'assets/item-icons/bike-icon.png',
      price: this.totalCubicFeet * this.priceMultiplier
    }

    this.checkoutService.customItems.push({
      name: customProduct.name,
      status: 'In Storage',
      startdate: null,
      path: customProduct.path,
      price: customProduct.price
    });

    this.checkoutService.addToCart(customProduct);
    this.checkoutService.increasepriceEstimate(this.priceEstimate + customProduct.price);
    if(this.checkoutService.counters[customProduct.name]){
      this.checkoutService.counters[customProduct.name] += 1;
    }else{
      this.checkoutService.counters[customProduct.name] = 1;
    }

    if(this.checkoutService.subscriptions[customProduct.plan_id]){
      this.checkoutService.subscriptions[customProduct.plan_id] += 1;
    }else{
      this.checkoutService.subscriptions[customProduct.plan_id] = 1;
    }
  }

}

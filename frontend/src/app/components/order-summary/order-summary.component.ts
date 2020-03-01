import { Component, OnInit } from '@angular/core';
import { PRODUCTS, product } from 'src/app/products';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';

export interface OrderItem {
  img: string;
  name: string;
  qty: number;
  price: string;
}

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {

  displayedColumns: string[] = ['name', 'qty', 'price'];
  checkout: OrderItem[] = [];
  recurring = 0;
  single = 0;

  constructor( private checkoutService: CheckoutService ) { 
    this.checkout = checkoutService.cart.map(item => {
      return {img: item.path, name: item.name, qty: checkoutService.counters[item.name], price: (checkoutService.counters[item.name] * item.price).toString() + '/mo'}
    })
    this.applyAddOns();
    this.single = this.getSingleSubtotal();
    this.checkoutService.currentpriceEstimate.subscribe(newpriceEstimate => this.recurring = newpriceEstimate);
  }

  ngOnInit() {
    console.log(this.checkoutService.subscriptions);
  }

  applyAddOns(){
    let service = this.checkoutService;
    if(service.supplyDropForm && service.supplyDropForm.get('deliveryMethod').value === 'CUSTOM'){
      this.addSingleLineItem('assets/item-icons/custom-item-icon.png', 'Custom Supply Drop Date', 45)
    }

    if(service.pickupForm && service.pickupForm.get('deliveryMethod').value === 'CUSTOM'){
      this.addSingleLineItem('assets/item-icons/custom-item-icon.png', 'Custom Pickup Date', 45)
    }

    if(service.addRoomService){
      this.addSingleLineItem('assets/item-icons/room-service-icon.png', 'Room Service', 25)
    }
  }

  addSingleLineItem(path: string, name: string, price: number){
    let singleLineItem = {
      img: path,
      name: name,
      qty: 1,
      price: price.toString(),
    }
    this.checkout.push(singleLineItem);
    return;
  }

  getSingleSubtotal(): number{
    let result = 0;

    let service = this.checkoutService;

    if(service.supplyDropForm && service.supplyDropForm.get('deliveryMethod').value === 'CUSTOM'){
      result += 45;
    }

    if(service.pickupForm && service.pickupForm.get('deliveryMethod').value === 'CUSTOM'){
      result += 45;
    }

    if(service.addRoomService){
      result += 25;
    }

    return result;
  }
}

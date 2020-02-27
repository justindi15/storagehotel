import { Component, OnInit } from '@angular/core';
import { PRODUCTS, product } from 'src/app/products';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';

export interface OrderItem {
  img: string;
  name: string;
  qty: number;
  price: number;
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
      return {img: item.path, name: item.name, qty: checkoutService.counters[item.name], price: item.price}
    })
    this.single = this.getSingleSubtotal();
    this.checkoutService.currentpriceEstimate.subscribe(newpriceEstimate => this.recurring = newpriceEstimate);
  }

  ngOnInit() {
    console.log(this.checkoutService.subscriptions);
  }

  getSingleSubtotal(): number{
    let result = 0;

    let service = this.checkoutService;

    if(service.supplyDropForm && this.checkoutService.supplyDropForm.get('deliveryMethod').value === 'CUSTOM'){
      result += 45;
    }

    if(service.pickupForm && service.pickupForm.get('deliveryMethod').value === 'CUSTOM'){
      result += 45;
    }

    return result;
  }
}

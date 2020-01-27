import { Component, OnInit } from '@angular/core';
import { PRODUCTS, product } from 'src/app/products';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';

export interface OrderItem {
  img: string;
  name: string;
  qty: number;
  space: number;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  displayedColumns: string[] = ['name', 'qty', 'space'];
  checkout: OrderItem[] = [];

  constructor( private checkoutService: CheckoutService ) { 
    this.checkout = checkoutService.getItems().map(item => {
      return {img: item.path, name: item.name, qty: checkoutService.counters[item.name], space: item.space}
    })

  }

  ngOnInit() {
  }

  getTotalSpace() {
    let result = 0
    this.checkout.map(item => {
      result += item.qty * item.space
    })
    return result;
  }
}

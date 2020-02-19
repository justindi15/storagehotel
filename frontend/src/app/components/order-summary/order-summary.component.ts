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

  constructor( private checkoutService: CheckoutService ) { 
    this.checkout = checkoutService.getItems().map(item => {
      return {img: item.path, name: item.name, qty: checkoutService.counters[item.name], price: item.price}
    })

  }

  ngOnInit() {
  }

  getTotalPrice() {
    let result = 0
    this.checkout.map(item => {
      result += item.qty * item.price
    })
    return result;
  }
}

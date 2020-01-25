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
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  displayedColumns: string[] = ['name', 'qty', 'space'];
  cart: OrderItem[] = [];

  constructor( private cartService: CheckoutService ) { 
    this.cart = cartService.getItems().map(item => {
      return {img: item.path, name: item.name, qty: cartService.counters[item.name], space: item.space}
    })

  }

  ngOnInit() {
  }

  getTotalSpace() {
    let result = 0
    this.cart.map(item => {
      result += item.qty * item.space
    })
    return result;
  }
}

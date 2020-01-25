import { Component, OnInit } from '@angular/core';
import { PRODUCTS, product } from 'src/app/products';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';

@Component({
  selector: 'app-order-catalog',
  templateUrl: './order-catalog.component.html',
  styleUrls: ['./order-catalog.component.css']
})
export class OrderCatalogComponent implements OnInit {
  products = PRODUCTS;
  spaceEstimate: number;
  cart: product[] = [];

  constructor( private cartService: CheckoutService ) {
    this.cartService.currentspaceEstimate.subscribe(newspaceEstimate => this.spaceEstimate = newspaceEstimate);
   }

  ngOnInit() {
  }



}

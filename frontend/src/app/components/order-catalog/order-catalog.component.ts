import { Component, OnInit } from '@angular/core';
import { PRODUCTS, product, storagebox } from 'src/app/products';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';

@Component({
  selector: 'app-order-catalog',
  templateUrl: './order-catalog.component.html',
  styleUrls: ['./order-catalog.component.css']
})
export class OrderCatalogComponent implements OnInit {
  products = PRODUCTS;
  storagebox = storagebox;
  priceEstimate: number;

  constructor( private checkoutService: CheckoutService ) {
    this.checkoutService.currentpriceEstimate.subscribe(newpriceEstimate => this.priceEstimate = newpriceEstimate);
   }

  ngOnInit() {
  }



}

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
  checkout: product[] = [];

  constructor( private checkoutService: CheckoutService ) {
    this.checkoutService.currentspaceEstimate.subscribe(newspaceEstimate => this.spaceEstimate = newspaceEstimate);
   }

  ngOnInit() {
  }



}

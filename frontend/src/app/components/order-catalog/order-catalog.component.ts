import { Component, OnInit } from '@angular/core';
import { products } from 'src/app/products';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-order-catalog',
  templateUrl: './order-catalog.component.html',
  styleUrls: ['./order-catalog.component.css']
})
export class OrderCatalogComponent implements OnInit {
  products = products;
  subtotal: number;

  constructor( private cartService: CartService ) {
    this.cartService.currentSubtotal.subscribe(newSubtotal => this.subtotal = newSubtotal);
   }

  ngOnInit() {
  }



}

import { Component, OnInit, Input } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {
  @Input() product: any;
  name: string;
  price: number;
  path: string;
  count: number;
  subtotal: number;

  constructor( private cartService: CartService ) {
    this.cartService.currentSubtotal.subscribe(newSubtotal => this.subtotal = newSubtotal);
  }

  ngOnInit() {
    this.count = 0;
    this.name = this.product.name;
    this.price = this.product.price;
    this.path = this.product.path;
  }

  increment() {
    this.count++;
    this.cartService.addToCart(this.product);
    this.cartService.increaseSubtotal(this.subtotal + this.price);
  }

  decrement() {
    if(this.count >= 1){
      this.count--;
      this.cartService.removeFromCart(this.product);
      this.cartService.decreaseSubtotal(this.subtotal - this.price);
    }
  }
}

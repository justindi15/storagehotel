import { Component, OnInit, Input } from '@angular/core';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {
  @Input() product: any;
  name: string;
  plan_id: string;
  price: number;
  path: string;
  count: number;
  priceEstimate: number;

  constructor( private checkoutService: CheckoutService ) {
    this.checkoutService.currentpriceEstimate.subscribe(newpriceEstimate => this.priceEstimate = newpriceEstimate);
  }

  ngOnInit() {
    this.name = this.product.name;
    this.price = this.product.price;
    this.path = this.product.path;
    this.plan_id = this.product.plan_id
    this.count = this.checkoutService.counters[this.name] || 0;
  }

  increment() {
    this.count++;
    this.checkoutService.addToCart(this.product);
    this.checkoutService.increasepriceEstimate(this.priceEstimate + this.price);
    this.checkoutService.counters[this.name] = this.count;
    this.checkoutService.subscriptions[this.plan_id] = this.count;
  }

  decrement() {
    if(this.count > 1){
      this.count--;
      this.checkoutService.removeFromCart(this.product);
      this.checkoutService.decreasepriceEstimate(this.priceEstimate - this.price);
      this.checkoutService.counters[this.name] = this.count;
      this.checkoutService.subscriptions[this.plan_id] = this.count;
    }else{
      if(this.count == 1){
        this.count--;
        this.checkoutService.removeFromCart(this.product);
        this.checkoutService.decreasepriceEstimate(this.priceEstimate - this.price);
        delete this.checkoutService.counters[this.name];
        delete this.checkoutService.subscriptions[this.plan_id];
      }
    }
  }
}

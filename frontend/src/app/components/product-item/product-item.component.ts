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
  space: number;
  path: string;
  count: number;
  spaceEstimate: number;

  constructor( private checkoutService: CheckoutService ) {
    this.checkoutService.currentspaceEstimate.subscribe(newspaceEstimate => this.spaceEstimate = newspaceEstimate);
  }

  ngOnInit() {
    this.name = this.product.name;
    this.space = this.product.space;
    this.path = this.product.path;
    this.count = this.checkoutService.counters[this.name] || 0;
  }

  increment() {
    this.count++;
    this.checkoutService.addTocheckout(this.product);
    this.checkoutService.increasespaceEstimate(this.spaceEstimate + this.space);
    this.checkoutService.counters[this.name] = this.count;
  }

  decrement() {
    if(this.count >= 1){
      this.count--;
      this.checkoutService.removeFromcheckout(this.product);
      this.checkoutService.decreasespaceEstimate(this.spaceEstimate - this.space);
      this.checkoutService.counters[this.name] = this.count;
    }
  }
}

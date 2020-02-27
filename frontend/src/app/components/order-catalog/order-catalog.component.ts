import { Component, OnInit, ViewChildren, QueryList} from '@angular/core';
import { PRODUCTS, product, storagebox } from 'src/app/products';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';
import { ProductItemComponent } from '../product-item/product-item.component';

@Component({
  selector: 'app-order-catalog',
  templateUrl: './order-catalog.component.html',
  styleUrls: ['./order-catalog.component.css']
})
export class OrderCatalogComponent implements OnInit {
  products = PRODUCTS;
  storagebox = storagebox;
  priceEstimate: number;

  @ViewChildren(ProductItemComponent) productComponents: QueryList<ProductItemComponent>

  constructor( private checkoutService: CheckoutService ) {
    this.checkoutService.currentpriceEstimate.subscribe(newpriceEstimate => this.priceEstimate = newpriceEstimate);
   }

  ngOnInit() {
  }

  decrementProduct(product){
    let productComponentArray = this.productComponents.toArray()
    for(let i = 0; i < productComponentArray.length; i ++){
      if(productComponentArray[i].name === product.name){
        productComponentArray[i].decrement();
        return;
      }
    }

  }

}

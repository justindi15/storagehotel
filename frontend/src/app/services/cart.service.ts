import { Injectable } from '@angular/core';
import { BehaviorSubject }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items = [];
  private subtotalSource = new BehaviorSubject(0);
  currentSubtotal = this.subtotalSource.asObservable();

  constructor() { }

  addToCart(product) {
    this.items.push(product);
    //TODO: test this
  }

  removeFromCart(product) {
    this.items.filter(item => {
      return item.name != product.name;
    });
    //TODO: test this
  }

  getItems() {
    return this.items;
  }

  
  increaseSubtotal(newSubtotal: number){
    this.subtotalSource.next(newSubtotal);
  }

  decreaseSubtotal(amount: number){
    this.subtotalSource.next(amount);
  }

  getQuantity(product){
    return this.items.filter(item => item.name == product.name).length;
  }

  
}

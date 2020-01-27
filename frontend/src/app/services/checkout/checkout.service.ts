import { Injectable } from '@angular/core';
import { BehaviorSubject }    from 'rxjs';
import { PRODUCTS, product } from 'src/app/products';
import { FormGroup } from '@angular/forms';
import { Moment } from 'moment';

export interface CounterMap {
  [key: string] : number;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  items: product[] = [];
  counters: CounterMap = {};
  address: FormGroup;
  date: Moment;
  time: string;

  private spaceEstimateSource = new BehaviorSubject(0);
  currentspaceEstimate = this.spaceEstimateSource.asObservable();

  constructor() { }

  addTocheckout(product: product) {
    for(let i=0; i < this.items.length; i++){
      if( this.items[i].name == product.name){
        return;
      }
    }
    this.items.push(product);
    //TODO: test this
  }

  removeFromcheckout(product: product) {
    for(let i=0; i < this.items.length; i++){
      if( this.items[i].name == product.name){
        this.items.splice(i, 1);
      }
    }
  }

  getItems() {
    return this.items;
  }

  increasespaceEstimate(newspaceEstimate: number){
    this.spaceEstimateSource.next(newspaceEstimate);
  }

  decreasespaceEstimate(amount: number){
    this.spaceEstimateSource.next(amount);
  }

}

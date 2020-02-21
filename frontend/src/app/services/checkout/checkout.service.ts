import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable }    from 'rxjs';
import { PRODUCTS, product } from 'src/app/products';
import { FormGroup } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

export interface CounterMap {
  [key: string] : number;
}

export interface subscription {
  plan: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  counters: CounterMap = {};
  address: FormGroup;
  phone: string;
  name: string;
  email: string;
  paymentMethodId: any;

  //TODO: handle these three variables for item plans and appointments
  supplyDropForm: FormGroup;
  pickupForm: FormGroup;
  cart: product[] = [];
  private priceEstimateSource = new BehaviorSubject(0);
  currentpriceEstimate = this.priceEstimateSource.asObservable();

  constructor(private auth: AuthenticationService) { }

  addToCart(product: product) {
    for(let i=0; i < this.cart.length; i++){
      if( this.cart[i].name == product.name){
        return;
      }
    }
    this.cart.push(product);
    //TODO: test this
  }

  removeFromCart(product: product) {
    for(let i=0; i < this.cart.length; i++){
      if( this.cart[i].name == product.name){
        this.cart.splice(i, 1);
      }
    }
  }

  getItems() {
    return this.cart;
  }

  increasepriceEstimate(newpriceEstimate: number){
    this.priceEstimateSource.next(newpriceEstimate);
  }

  decreasepriceEstimate(amount: number){
    this.priceEstimateSource.next(amount);
  }

  pay(): Observable<any> {
    const postData = {
      name: this.name,
      phone: this.phone,
      email: this.email,
      payment_method: this.paymentMethodId,
      address: {
        line1: this.address.get('address').value,
        line2: this.address.get('address2').value,
        city: this.address.get('city').value,
        postalcode: this.address.get('postalcode').value,
      },
      subscriptions: this.getPlans(this.cart),
      startdate: this.pickupForm.get('date').value.getTime() / 1000,
    }
    return this.auth.register(postData);
  }

  private getPlans(cart: product[]): subscription[]{
    let subscriptions: subscription[] = [];
    cart.forEach((item)=>{
      subscriptions.push({
        plan: item.plan_id,
        quantity: this.counters[item.name]
      });
    })
    return subscriptions;
  }

}

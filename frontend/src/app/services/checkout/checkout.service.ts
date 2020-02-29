import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable }    from 'rxjs';
import { PRODUCTS, product } from 'src/app/products';
import { FormGroup } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

export interface CounterMap {
  [key: string] : number;
}

export interface SubscriptionMap {
  [key: string] : number;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  subscriptions: SubscriptionMap = {};
  customItems = [];
  counters: CounterMap = {};
  address: FormGroup;
  phone: string;
  name: string;
  email: string;
  paymentMethod: any;
  singleSubtotal = 0;
  school: string;
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
      if((this.cart[i].name === product.name) && (this.counters[product.name] === 1)){
        this.cart.splice(i, 1);
      }
    }
  }

  getItems() {
    let items = []
    this.cart.forEach(product => {
      for(let i = 0; i < this.counters[product.name]; i++){
        items.push(product);
      }
    })
    return items;
  }

  increasepriceEstimate(newpriceEstimate: number){
    this.priceEstimateSource.next(newpriceEstimate);
  }

  decreasepriceEstimate(amount: number){
    this.priceEstimateSource.next(amount);
  }

  pay(): Observable<any> {
    let boxes = this.getItems().filter((product)=> product.plan_id === 'box').map((product)=> product.name);
    let items = this.getItems().map((product)=> product.name);
    const postData = {
      name: this.name,
      phone: this.phone,
      email: this.email,
      paymentMethod: this.paymentMethod,
      address: {
        line1: this.address.get('line1').value,
        line2: this.address.get('line2').value,
        city: this.address.get('city').value,
        postal_code: this.address.get('postal_code').value,
      },
      subscriptions: this.getPlans(this.cart),
      startdate: this.pickupForm.get('date').value.getTime() / 1000,
      supplyDropAppointment: this.formToAppointment(this.supplyDropForm, boxes,  "SUPPLY DROPOFF"),
      pickupAppointment: this.formToAppointment(this.pickupForm, items, "PICK UP"),
      customItems: this.customItems.map((item)=>{item.startdate = this.pickupForm.get('date').value; return item;})
    }
    console.log(postData);
    return this.auth.register(postData);
  }

  formToAppointment(form: FormGroup, items: string[], appointmentType: String){
    if (form.get('date').value !== '' && form.get('time').value !== ''){
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const appointment = {
        items: items,
        address: this.address.value,
        date: form.get('date').value.toLocaleDateString("en-US", options),
        time: form.get('time').value,
        appointmentType: appointmentType,
      }
      return appointment;
    }else{
      return null;
    }
  }

  addItemsToUser(email: string, stripe_id: string): Observable<any>{
    let boxes = this.getItems().filter((product)=> product.plan_id === 'box').map((product)=> product.name);
    let items = this.getItems().map((product)=> product.name);
    const postData = {
      email: email,
      stripe_id: stripe_id,
      address: {
        line1: this.address.get('line1').value,
        line2: this.address.get('line2').value,
        city: this.address.get('city').value,
        postal_code: this.address.get('postal_code').value,
      },
      subscriptions: this.getPlans(this.cart),
      startdate: this.pickupForm.get('date').value.getTime() / 1000,
      supplyDropAppointment: this.formToAppointment(this.supplyDropForm, boxes,  "SUPPLY DROPOFF"),
      pickupAppointment: this.formToAppointment(this.pickupForm, items, "PICK UP"),
      customItems: this.customItems.map((item)=>{item.startdate = this.pickupForm.get('date').value; return item;})
    }
    return this.auth.addItemsToUser(postData);
  }

  private getPlans(cart: product[]): any[]{
    let plans = [];
    let planIDArray = Object.keys(this.subscriptions);
    for(let i=0; i < planIDArray.length; i++){
      plans.push({
        plan: planIDArray[i],
        quantity: this.subscriptions[planIDArray[i]]
      })
    }
    return plans;
  }

  public hasSupplies(){
    let boxes = this.cart.filter((item)=>item.plan_id === 'box');
    return (boxes.length > 0)
  }

}

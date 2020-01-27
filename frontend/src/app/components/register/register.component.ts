import { Component, AfterViewInit, Output, ViewChild, ElementRef } from '@angular/core';
import {FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Router } from '@angular/router';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
declare var Stripe: any;


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements AfterViewInit {

  @ViewChild('cardElement', {static: false}) cardElement: ElementRef;

  errorMessage = "";
  paymentCardComplete = false;
  total_price = 100.00; //TODO: get actual cost
  loading = false;
  stripe: any;
  card: any;
  time: string;
  date: string;
  address: FormGroup;

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(private auth: AuthenticationService, private router: Router, private checkout: CheckoutService) { 
    if(this.checkout.date){
      this.date = this.checkout.date.format("MMM. D, YYYY");
    }

    if(this.checkout.time){
      this.time = this.checkout.time;
    }

    if(this.checkout.address){
      this.address = this.checkout.address;
    }
  }

  ngAfterViewInit() {
    this.stripe = Stripe('pk_test_5a2TCCMA5DwDCiC8BjmQBGyI');

    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount(this.cardElement.nativeElement);
    this.card.addEventListener('change', event => {
      if (event.complete){
        this.paymentCardComplete = true;
      } else {
        this.paymentCardComplete = false;
      }
      
      if (event.error) {
        this.errorMessage = event.error.message;
      } else {
        this.errorMessage = "";
      }
    });
  }

  getErrorMessage(input) {
    switch (input) {
      case 'email':
        return this.registerForm.get('email').hasError('required') ? 'You must enter a value' :
          this.registerForm.get('email').hasError('email') ? 'Not a valid email' :
            '';
    }
  }

  onSubmit(){
    console.log('form submitted!')
    event.preventDefault();
    this.stripe.createPaymentMethod({
      type: 'card',
      card: this.card,
    }).then(result => {
      if (result.error) {
        this.errorMessage = result.error.message;
      } else {
        this.loading = true;
        this.registerUser(result.paymentMethod.id);
      }
    });
  }

  registerUser(paymentMethodId: any) {
    let form = this.registerForm;
    const postData = {
      name: form.get('name').value,
      email: form.get('email').value,
      password: 'test', //TODO: change this
      payment_method: paymentMethodId,
    }
    this.auth.register(postData).subscribe(() => {
      //TODO: handle successful payment 
      alert('successfully subscribed!')
      this.loading = false;
    }, (err) => {
      this.errorMessage = err.error.message;
      this.loading = false
    });
  }

}

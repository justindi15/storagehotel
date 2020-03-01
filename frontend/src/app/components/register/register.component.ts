import { Component, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import {FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
declare var Stripe: any;


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements AfterViewInit {

  @ViewChild('cardElement', {static: false}) cardElement: ElementRef;
  @Input() single: number = 0;

  creditcard: any;
  isLoggedIn: boolean = false;
  hasAccount: boolean = false;
  errorMessage = "";
  paymentCardComplete = false;
  price: number;
  loading = false;
  stripe: any;
  card: any;
  supplyDropForm: FormGroup;
  pickupForm: FormGroup;
  address: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email])

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })


  constructor(private router: Router, private checkout: CheckoutService, private auth: AuthenticationService) { 
    this.checkout.currentpriceEstimate.subscribe(newpriceEstimate => this.price = newpriceEstimate);
    if(this.checkout.supplyDropForm){
      this.supplyDropForm = this.checkout.supplyDropForm;
    }

    if(this.checkout.pickupForm){
      this.pickupForm = this.checkout.pickupForm;
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

  onSubmit(){
    console.log('form submitted!')
    event.preventDefault();

    this.stripe.createToken(this.card).then((result)=>{
      if (result.error) {
        this.errorMessage = result.error.message;
      } else {
        this.loading = true;
        this.checkout.cardToken = result.token;
        this.checkout.email = this.email.value;
        this.checkout.pay().subscribe(() => {
          alert('successfully subscribed!')
          this.loading = false;
        }, (err) => {
          console.log(err);
          this.errorMessage = err.error.message;
          this.loading = false
        });
      }
    })
  }

  getDate(form: FormGroup): String{
    if(form.valid){
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      if(form){
        let date = form.get('date').value
        return date.toLocaleDateString("en-US", options);
      }
    }
  }

  login() {
    const postData = this.loginForm.value
    event.preventDefault();
    this.loading = true
    this.auth.login(postData).subscribe((res) => {
      this.loading = false;
      if(this.auth.isLoggedIn()){
        let userDetails = this.auth.getUserDetails();
        this.creditcard = userDetails.creditCard;
        this.isLoggedIn = true;
      }
    }, (err) => {
      console.log(err);
      this.errorMessage = err.error.message;
      this.loading = false
    });
  }

  addItemsToUser(){
    this.loading = true;
    let userDetails = this.auth.getUserDetails();
    this.checkout.addItemsToUser(userDetails.email ,userDetails.stripe_id).subscribe(() => {
      alert('successfully subscribed!')
      this.loading = false;
    }, (err) => {
      console.log(err);
      this.errorMessage = err.error.message;
      this.loading = false
    });
  }
}

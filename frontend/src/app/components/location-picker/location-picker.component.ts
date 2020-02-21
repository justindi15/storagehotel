import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, Validators, FormGroup } from '@angular/forms';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';


@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.css']
})
export class LocationPickerComponent implements OnInit {
  @ViewChild("placesRef", {static: false}) placesRef: GooglePlaceDirective;
  confirmed: boolean = false;
  options = {
    componentRestrictions: {
      country: ['CA']
    },
    types: ['address'],
  }

  name = new FormControl('', Validators.required);
  phone = new FormControl('', Validators.required);

  locationForm = new FormGroup({
    address: new FormControl('', [Validators.required]),
    address2: new FormControl(''),
    city: new FormControl('', [Validators.required]),
    postalcode: new FormControl('', [Validators.required]),
  })

  constructor( private checkoutService: CheckoutService ) { 
    if(this.checkoutService.address) {
      this.locationForm = this.checkoutService.address;
      this.handleClick();
    }
  }

  ngOnInit() {

  }

  handleClick(){
    if(this.confirmed){
      this.confirmed = !this.confirmed;
    }else{
      this.checkoutService.address = this.locationForm;
      this.checkoutService.name = this.name.value;
      this.checkoutService.phone = this.phone.value;
      this.confirmed = !this.confirmed;
    }
  }
    
  public handleAddressChange(address: any) {
    let streetnumber: string;
    let streetname: string;
    let city: string
    let postalcode: string;

    address.address_components.forEach(component => {
      switch (component.types[0]) {
        case "street_number":
          streetnumber = component.long_name;
          break;
        case "route":
          streetname = component.long_name;
          break;
        case "locality":
          city = component.long_name;
          break;
        case "postal_code":
          postalcode = component.long_name;
          break;
        default:
          break;
      }
    });
    this.locationForm.patchValue({
      address: streetnumber + " " + streetname,
      city: city,
      postalcode: postalcode
    })
  }

}

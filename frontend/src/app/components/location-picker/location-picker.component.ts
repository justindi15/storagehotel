import { Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {FormControl, Validators, FormGroup } from '@angular/forms';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';
import { School, LatLng, SCHOOLS} from 'src/app/schools';
import {} from 'googlemaps';

const VancouverServiceArea = new google.maps.LatLngBounds(
  new google.maps.LatLng(49.20031, -123.26775),
  new google.maps.LatLng(49.3634, -122.72422));

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.css']
})
export class LocationPickerComponent implements OnInit {
  @Output() confirmedEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() schoolEmitter: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild("placesRef", {static: false}) placesRef: GooglePlaceDirective;
  confirmed: boolean = false;
  options = {
    componentRestrictions: {
      country: ['CA']
    },
    types: [],
    bounds: VancouverServiceArea,
    strictBounds: true
  }
  schools = SCHOOLS;

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
      this.confirmedEmitter.emit(false);
      this.confirmed = false;
    }else{
      this.checkoutService.address = this.locationForm;
      this.checkoutService.name = this.name.value;
      this.checkoutService.phone = this.phone.value;
      this.confirmed = true;
      this.schoolEmitter.emit(this.checkoutService.school);
      this.confirmedEmitter.emit(true);
    }
  }
    
  public handleAddressChange(address: any) {
    let streetnumber: string;
    let streetname: string;
    let city: string
    let postalcode: string;
    let GeoPoint: LatLng = {
      lat: address.geometry.location.lat(),
      lng: address.geometry.location.lng()
    }
    console.log(GeoPoint);
    this.checkoutService.school = this.getSchool(GeoPoint);
    console.log(this.checkoutService.school);

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

  private isInSchool(geoPoint: LatLng, school: School): boolean{
    let upperRight = school.upperRight
    let lowerLeft = school.lowerLeft

    return ((geoPoint.lat <= upperRight.lat) &&
            (geoPoint.lat >= lowerLeft.lat) &&
            (geoPoint.lng >= lowerLeft.lng) &&
            (geoPoint.lng <= upperRight.lng))
  }

  public getSchool(geoPoint: LatLng): string{
    let result = "none"
    this.schools.forEach((school)=>{
      if(this.isInSchool(geoPoint, school)){
        result = school.name
      }
    })
    return result;
  }
}

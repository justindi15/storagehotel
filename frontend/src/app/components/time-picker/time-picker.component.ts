import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { School, SCHOOLS, FreeDate} from 'src/app/schools';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements OnInit {
 
  @Output() BookingCompleted: EventEmitter<boolean> = new EventEmitter<boolean>();
  today = new Date();
  schools: School[] = SCHOOLS
  index: number;
  isDisabled: boolean;
  FreePickupDates: FreeDate[] = []
  SupplyDropDates: FreeDate[] = []
  preferredTimes = [
    '7:00am to 9:00am',
    '9:00am to 11:00am',
    '11:00am to 1:00pm',
    '1:00pm to 3:00pm',
    '3:00pm to 5:00pm',
    '5:00pm to 7:00pm',
  ]

  supplyDropForm = new FormGroup({
    deliveryMethod: new FormControl('FREE', Validators.required),
    date: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required),
  })

  pickupForm = new FormGroup({
    deliveryMethod: new FormControl({value: 'FREE', disabled: true}, Validators.required),
    date: new FormControl({value: '', disabled: true}, Validators.required),
    time: new FormControl({value: '', disabled: true}, Validators.required),
  })

  constructor(private checkout: CheckoutService) { 
  }

  ngOnInit() {
    this.isDisabled = true;
    this.supplyDropForm.get('deliveryMethod').disable()
    this.supplyDropForm.get('date').disable()
    this.supplyDropForm.get('time').disable()
  }

  myFilter = (date: Date | null): boolean => {
    let result = true;
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    this.schools.forEach((school)=>{
      school.FreePickupDates.forEach((freeDate: FreeDate)=>{
        if( year === freeDate.value.getFullYear() &&
            month === freeDate.value.getMonth() &&
            day === freeDate.value.getDate()
          ){
          result = false;
        }
      })
      school.SupplyDropDates.forEach((freeDate: FreeDate)=>{
        if( year === freeDate.value.getFullYear() &&
            month === freeDate.value.getMonth() &&
            day === freeDate.value.getDate()
        ){
          result = false;
        }
      })
    })
    return result;
  }


  onNext(){
    this.index = 1;
    this.checkout.supplyDropForm = this.supplyDropForm;
  }

  onSubmit(){
    this.checkout.supplyDropForm = this.supplyDropForm;
    this.checkout.pickupForm = this.pickupForm;
    this.BookingCompleted.emit(true);
  }

  enable(){
    this.isDisabled = false;
    this.enableForm(this.supplyDropForm);
    this.enableForm(this.pickupForm);
  }

  enableForm(form: FormGroup){
    form.get('deliveryMethod').enable();
    form.get('date').enable();
    form.get('time').enable();
  }

  disableForm(form: FormGroup){
    form.get('deliveryMethod').disable();
    form.get('date').disable();
    form.get('time').disable();
  }

  resetForm(form: FormGroup){
    form.get('deliveryMethod').patchValue('FREE')
    form.get('date').reset();
    form.get('time').reset();
  }

  reset(){
    console.log('resetting')
    this.index = 0;
    this.isDisabled = true;
    this.resetForm(this.supplyDropForm);
    this.resetForm(this.pickupForm);
    this.disableForm(this.supplyDropForm);
    this.disableForm(this.pickupForm);
  }

  setFreePickupDates(schoolname: string){
    for(let i = 0; i < this.schools.length; i++){
      if(schoolname === this.schools[i].name){
        this.FreePickupDates = this.schools[i].FreePickupDates;
        this.SupplyDropDates = this.schools[i].SupplyDropDates;
        return;
      }
    }
    this.FreePickupDates = [];
    this.SupplyDropDates = [];
  }

  minDate(supplyDropDate: Date): Date{
    let mindate = new Date(supplyDropDate)
    mindate.setDate(mindate.getDate() + 1);
    return mindate;
  }
}

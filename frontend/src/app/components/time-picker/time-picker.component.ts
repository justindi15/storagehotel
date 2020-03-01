import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { School, SCHOOLS, FreeDate} from 'src/app/schools';

export const atleastOneDate: ValidatorFn = (form: FormGroup): ValidationErrors | null => {
  const freeDate = form.get('freeDate');
  const customDate = form.get('customDate');

  return freeDate || customDate ? null: { 'atleastOneDate': true }
};

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
  isFirstTabDisabled: boolean;
  isSecondTabDisabled: boolean;
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
    freeDate: new FormControl(''),
    customDate: new FormControl(''),
    time: new FormControl('', Validators.required),
  }, {validators: atleastOneDate})

  pickupForm = new FormGroup({
    deliveryMethod: new FormControl({value: 'FREE', disabled: true}, Validators.required),
    freeDate: new FormControl({value: '', disabled: true}),
    customDate: new FormControl({value: '', disabled: true}),
    time: new FormControl({value: '', disabled: true}, Validators.required),
  }, {validators: atleastOneDate})

  constructor(private checkout: CheckoutService) { 
  }

  ngOnInit() {
    this.index = 0;
    this.isFirstTabDisabled = true;
    this.isSecondTabDisabled = true;
    this.checkout.supplyDropForm = this.supplyDropForm;
    this.checkout.pickupForm = this.pickupForm;
    this.supplyDropForm.get('deliveryMethod').disable()
    this.supplyDropForm.get('freeDate').disable()
    this.supplyDropForm.get('customDate').disable()
    this.supplyDropForm.get('time').disable()
    this.onPickupFormChange();
  }

  onPickupFormChange(){
    this.pickupForm.statusChanges.subscribe(val=>{
      if(val === 'VALID'){
        this.checkout.pickupForm = this.submitForm(this.pickupForm);
      }
    })
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

  submitForm(form: FormGroup): FormGroup{
    let deliveryMethod = form.get('deliveryMethod').value
    let time = form.get('time').value;
    let submissionForm = new FormGroup({});
    submissionForm.addControl('time', new FormControl(time));
    submissionForm.addControl('deliveryMethod', new FormControl(deliveryMethod));
    if(deliveryMethod === 'FREE'){
      submissionForm.addControl('date', new FormControl(form.get('freeDate').value));
    }else{
      submissionForm.addControl('date', new FormControl(form.get('customDate').value));
    }
    return submissionForm;
  }

  onNext(){
    this.resetForm(this.pickupForm);
    this.checkout.supplyDropForm = this.submitForm(this.supplyDropForm);
    this.isSecondTabDisabled = false;
    this.index = 1;
    this.isFirstTabDisabled = true;
  }

  onBack(){
    this.isFirstTabDisabled = false;
    this.index = 0;
    this.isSecondTabDisabled = true;
  }

  onSubmit(){
    if(this.checkout.hasSupplies()){
      this.checkout.supplyDropForm = this.submitForm(this.supplyDropForm);
    }else{
      this.supplyDropForm.reset({
        deliveryMethod: new FormControl('FREE', Validators.required),
        freeDate: new FormControl(''),
        customDate: new FormControl(''),
        time: new FormControl('', Validators.required),
      })
      this.checkout.supplyDropForm = this.supplyDropForm;
    }
    this.checkout.pickupForm = this.submitForm(this.pickupForm);
    this.BookingCompleted.emit(true);
  }

  enable(){
    if(this.checkout.hasSupplies()){
      this.isFirstTabDisabled = false;
      this.isSecondTabDisabled = true;
      this.enableForm(this.supplyDropForm);
    }else{
      this.isSecondTabDisabled = false;
    }
    this.enableForm(this.pickupForm);
  }

  enableForm(form: FormGroup){
    form.get('deliveryMethod').enable({emitEvent: false});
    form.get('freeDate').enable({emitEvent: false});
    form.get('customDate').enable({emitEvent: false});
    form.get('time').enable({emitEvent: false});
  }

  disableForm(form: FormGroup){
    form.get('deliveryMethod').disable({emitEvent: false});
    form.get('freeDate').disable({emitEvent: false});
    form.get('customDate').disable({emitEvent: false});
    form.get('time').disable({emitEvent: false});
  }

  resetForm(form: FormGroup){
    form.get('deliveryMethod').patchValue('FREE')
    form.get('freeDate').reset();
    form.get('customDate').reset();
    form.get('time').reset();
  }

  reset(){
    this.index = 0;
    this.resetForm(this.supplyDropForm);
    this.resetForm(this.pickupForm);
    this.disableForm(this.supplyDropForm);
    this.disableForm(this.pickupForm);
    this.isFirstTabDisabled = true;
    this.isSecondTabDisabled = true;
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

  pickupMinDate(): Date{
    if(!this.checkout.hasSupplies()){
      return new Date();
    }
    let supplyDropDate = this.checkout.supplyDropForm && this.checkout.supplyDropForm.get('date').value;
    if(supplyDropDate){
      let mindate = new Date(supplyDropDate)
      mindate.setDate(mindate.getDate() + 1);
      return mindate;
    }else{
      return new Date();
    }
  }
}

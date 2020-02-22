import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper'

export interface PickupDate {
  value: Date,
  label: string,
}

@Component({
  selector: 'app-retrieve-modal',
  templateUrl: './retrieve-modal.component.html',
  styleUrls: ['./retrieve-modal.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS,
    useValue: { displayDefaultIndicatorType: false }
  }]
})
export class RetrieveModalComponent implements OnInit {

  @Output()
  success: EventEmitter<boolean> = new EventEmitter<boolean>();

  FreePickupDates: PickupDate[] = [
    {value: new Date(2020, 3, 1), label: 'April 1, 2020'},
    {value: new Date(2020, 3, 2), label: 'April 2, 2020'},
    {value: new Date(2020, 3, 3), label: 'April 3, 2020'},
    {value: new Date(2020, 3, 4), label: 'April 4, 2020'},
  ]

  items = []
  deliveryMethod = "1";
  email = "";
  itemCheckboxes = new FormArray([], Validators.required);

  secondFormGroup = new FormGroup({
    line1: new FormControl('', Validators.required),
    line2: new FormControl(''),
    city: new FormControl('', Validators.required),
    postal_code: new FormControl('', Validators.required)
  })
  thirdFormGroup = new FormGroup({
    date: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required)
  })

  constructor(public dialogRef: MatDialogRef<RetrieveModalComponent> ,@Inject(MAT_DIALOG_DATA) public data: any, private auth: AuthenticationService) {
    if(data){
      this.items = data.items
      this.email = data.email;
      let {line1, line2, city, postal_code} = data.address
      this.secondFormGroup.setValue({line1: line1, line2: line2, city: city, postal_code: postal_code});
    }
  }

  ngOnInit() {
  }

  closeDialog(res: any): void {
    this.dialogRef.close(res);
  }

  onSubmit() {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const appointment = {
        items: this.itemCheckboxes.value,
        address: this.secondFormGroup.value,
        date: this.thirdFormGroup.get('date').value.toLocaleDateString("en-US", options),
        time: this.thirdFormGroup.get('time').value,
        appointmentType: "DELIVERY",
      }

    this.auth.addAppointment(this.email, appointment).subscribe(res => {
      this.closeDialog(true);
    }, err => {
      this.closeDialog(err);
    })
  }

  onCheckboxChange(event: any, item: string) {

    const formArray: FormArray = this.itemCheckboxes as FormArray;

    if (event.checked) {
      const control = new FormControl(item)
      formArray.push(control);
    } else {
      // find the unselected element
      let i: number = 0;
      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value == item) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

}

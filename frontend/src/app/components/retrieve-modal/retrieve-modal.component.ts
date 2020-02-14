import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import * as moment from 'moment';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-retrieve-modal',
  templateUrl: './retrieve-modal.component.html',
  styleUrls: ['./retrieve-modal.component.css']
})
export class RetrieveModalComponent implements OnInit {

  @Output()
  success: EventEmitter<boolean> = new EventEmitter<boolean>();

  items = []
  deliveryMethod = "1";
  email = "";
  itemCheckboxes = new FormArray([], Validators.required);

  secondFormGroup = new FormGroup({
    address: new FormControl('6071 Dunsmuir Cres. Richmond, BC, Canada V7C 5T7', Validators.required)
  })
  thirdFormGroup = new FormGroup({
    date: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required)
  })

  constructor(public dialogRef: MatDialogRef<RetrieveModalComponent> ,@Inject(MAT_DIALOG_DATA) public data: any, private auth: AuthenticationService) {
    if(data){
      this.items = data.items;
      this.email = data.email;
    }
  }

  ngOnInit() {
  }

  closeDialog(res: any): void {
    this.dialogRef.close(res);
  }

  onSubmit() {
    let stringDate: String;
    if(moment.isMoment(this.thirdFormGroup.get('date').value)){
      let momentDate = this.thirdFormGroup.get('date').value
      stringDate = momentDate.format("MMMM D, YYYY")
    }else{
      stringDate = this.thirdFormGroup.get('date').value
    }
      const appointment = {
        items: this.itemCheckboxes.value,
        address: this.secondFormGroup.get('address').value,
        date: stringDate,
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

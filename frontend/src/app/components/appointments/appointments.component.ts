import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {

  @Input()
  appointments =[]

  @Input()
  email: string;

  @Output()
  deletedAppointment: EventEmitter<any> = new EventEmitter<any>();

  constructor(private auth: AuthenticationService) { }

  ngOnInit() {
  }

  getMonth(appointment: any): string{
    if(appointment.date){
      let res = appointment.date.split(" ")
      return res[0];
    }
  }

  getDayOfMonth(appointment: any): string{
    if(appointment.date){
      let res = appointment.date.split(" ")
      let dirtyDay = res[1]
      let day = dirtyDay.split(",")[0]
      return day;
    }
  }

  onClickCancel(appointmentId){
    if(appointmentId && this.email){
      this.auth.deleteAppointment(this.email, appointmentId).subscribe(res=>{
          this.deletedAppointment.emit(true);
      }, err => {
          this.deletedAppointment.emit(false);
      })
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import * as moment from 'moment';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  name = "-";
  phone = "-";
  email = "-";
  address = "-"
  items = [];
  appointments = [];

  constructor(private auth: AuthenticationService, private snackbar: MatSnackBar, private router: Router) { }

  ngOnInit() {
    this.getUserData();
  }

  update(){
    this.getUserData();
  }

  getUserData() {
    this.auth.profile().subscribe(user => {
      // this.items = (user.items || []);
      this.email = (user.email || "-");
      this.name = (user.name || "-");
      this.address = (user.address || "-");
      this.phone = (user.phone || "-");
      this.appointments = (user.appointments || []);
      console.log(user);
    }, (err) => {
      console.error(err);
    });
  }

  onBookingSuccess(success){
    if(success){
      this.openSnackBar("Created new delivery appointment")
      this.update();
    }
  }

  onDeletedAppointment(event){
    if(event){
      this.openSnackBar("Cancelled appointment")
      this.update();
    }else{
      this.openSnackBar("Failed to cancel this appointment. Contact us for help.")
    }
  }

  openSnackBar(message: string) {
    this.snackbar.open(message, null, {
      duration: 4000,
      verticalPosition: 'top'
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/signin');
  }

}

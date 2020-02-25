import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import * as moment from 'moment';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PRODUCTS, product, storagebox } from 'src/app/products';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  products = PRODUCTS;
  storagebox = storagebox;
  name = "-";
  phone = "-";
  email = "-";
  address = "-"
  items = [];
  appointments = [];

  constructor(private auth: AuthenticationService, private snackbar: MatSnackBar, private router: Router) { }

  ngOnInit() {
    this.getUserData();
    this.auth.profile().subscribe(user => {
      this.importItems(user.items);
    }, (err) => {
      console.error(err);
    });
  }

  update(){
    this.getUserData();
  }

  getUserData() {
    let today = new Date();
    this.auth.profile().subscribe(user => {
      this.email = (user.email || "-");
      this.name = (user.name || "-");
      this.address = (user.address || "-");
      this.phone = (user.phone || "-");
      this.appointments = user.appointments.map((appointment)=> {
        if(appointment.date < today){
          this.auth.deleteAppointment(user.email, appointment._id);
        }else{
          return appointment;
        }
      });
      console.log(user);
    }, (err) => {
      console.error(err);
    });
  }

  importItems(userItems){
    userItems.forEach((plan)=>{
      let item = {
        "name": '',
        "path": '',
        "status": 'In Storage',
        "price": null,
      }
      if(plan.plan_id === 'box'){
        item.name = storagebox.name;
        item.path = storagebox.path;
        item.price = storagebox.price;
      }else{
        this.products.forEach((product)=>{
          if(plan.plan_id == product.plan_id){
            item.name = product.name;
            item.path = product.path;
            item.price = product.price;
          }
        })
      }
      var options = { year: 'numeric', month: 'long', day: 'numeric' };
      if((plan.status === 'not_started') && plan.startdate){
        let date = new Date(plan.startdate * 1000).toLocaleDateString("en-US", options);
        item.status = 'Pick up on ' + date
      }
      for(let i = 0; i < plan.quantity; i++){
        this.items.push(item);
      }
  })
  console.log(this.items);
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

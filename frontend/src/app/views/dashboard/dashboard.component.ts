import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  items = [];

  constructor(private auth: AuthenticationService) { }

  ngOnInit() {
    
    this.auth.profile().subscribe(user => {
      console.log(user);
      this.items = user.items;
    }, (err) => {
      console.error(err);
    });
  

  }

}

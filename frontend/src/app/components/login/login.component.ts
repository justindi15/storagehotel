import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor() { }

  ngOnInit() {
  }

  getErrorMessage() {
    return this.loginForm.get('email').hasError('email') ? 'Not a valid email' :
            '';
  }

}

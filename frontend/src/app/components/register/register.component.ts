import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  constructor(private auth: AuthenticationService) { }

  ngOnInit() {
  }

  getErrorMessage(input) {
    switch (input) {
      case 'email':
        return this.registerForm.get('email').hasError('required') ? 'You must enter a value' :
          this.registerForm.get('email').hasError('email') ? 'Not a valid email' :
            '';
    }
  }

  registerUser(){
    const postData = this.registerForm.value;

    console.log(postData);
    this.auth.register(postData)
  }

}

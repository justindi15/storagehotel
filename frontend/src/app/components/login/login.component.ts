import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  loginError = "";
  emailVerified: boolean = false;
  emailDisabled: boolean;


  constructor(private auth: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  getErrorMessage() {
    return this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  loginUser() {
    const postData = {
      email: this.email.value,
      password: this.password.value,
    };
    console.log(postData);

    this.auth.login(postData).subscribe(() => {
      this.router.navigateByUrl('/dashboard');
    }, (err) => {
      this.loginError = err.error.message;
    });
  }

  verifyEmail() {
    
    this.auth.verifyEmail(this.email.value).subscribe((res)=>{
      console.log(res);
      this.emailVerified = true;
    }, (err) => {
      if(err.status == 401){
        this.emailDisabled = true;
      }
      console.log(err);
      this.loginError = err.error.message;
    })
  }

}

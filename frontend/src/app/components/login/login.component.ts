import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

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


  constructor(private auth: AuthenticationService, private router: Router, private snackbar: MatSnackBar) { }

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

    this.auth.login(postData).subscribe(() => {
      this.router.navigateByUrl('/dashboard');
    }, (err) => {
      this.loginError = err.error.message;
    });
  }

  verifyEmail() {
    
    this.auth.verifyEmail(this.email.value).subscribe((res)=>{
      this.emailVerified = true;
    }, (err) => {
      if(err.status == 401){
        this.emailDisabled = true;
      }
      this.loginError = err.error.message;
    })
  }

  resendActivationEmail() {
    if((this.email.valid) && (this.email.value !== '')){
      this.auth.resendActivationEmail(this.email.value).subscribe((res)=>{
          this.openSnackBar('Resent Activation Email to ' + this.email.value);
      }, (err)=>{
        this.openSnackBar(err.error.message)
      });
    }
  }

  openSnackBar(message: string) {
    this.snackbar.open(message, null, {
      duration: 2000,
      verticalPosition: 'top'
    });
  }

}

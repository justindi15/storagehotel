import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginError = "";

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private auth: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  getErrorMessage() {
    return this.loginForm.get('email').hasError('email') ? 'Not a valid email' :
            '';
  }

  loginUser() {
    const postData = this.loginForm.value;
    console.log(postData);

    this.auth.login(postData).subscribe(() => {
      this.router.navigateByUrl('/book');
    }, (err) => {
      this.loginError = err.error.message;
    });
  }

}

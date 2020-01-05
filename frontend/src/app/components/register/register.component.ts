import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerError = "";

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  constructor(private auth: AuthenticationService, private router: Router) { }

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

  registerUser() {
    const postData = this.registerForm.value;
    if (this.passwordsMatch()) {
      this.auth.register(postData).subscribe(() => {
        this.router.navigateByUrl('/book');
      }, (err) => {
        this.registerError = err.error.message;
      });

    } else {
      this.registerError = "Passwords do not match"
    }
  }

  private passwordsMatch(): boolean {
    return this.registerForm.get('password').value === this.registerForm.get('confirmPassword').value;
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import {MatSnackBar} from '@angular/material/snack-bar';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return control.touched && (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})

export class ActivateComponent implements OnInit {

  email: string;
  token: string;
  matcher = new MyErrorStateMatcher();
  activateError: string;

  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, this.checkPasswords);

  constructor(private route: ActivatedRoute, private auth: AuthenticationService, private router: Router, private snackbar: MatSnackBar) { }

  ngOnInit() {
  this.token = this.route.snapshot.paramMap.get("token")
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
  let password = group.get('password').value;
  let confirmPassword = group.get('confirmPassword').value;

  return password === confirmPassword ? null : { notSame: true }     
  }

  activateAccount(){
      const password = this.passwordForm.get('password').value;
      const token = this.token;

    this.auth.activate(token, password).subscribe((res)=>{
      this.router.navigateByUrl('/signin');
      this.openSnackBar("Your account has been activated")
    }, (err) => {
      this.activateError = err.error.message;
    })
  }

  openSnackBar(message: string) {
    this.snackbar.open(message, null, {
      duration: 4000,
      verticalPosition: 'top'
    });
  }

}

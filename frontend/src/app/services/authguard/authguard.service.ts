import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthenticationService, private router: Router) {}

  canActivate() {
    if (!this.auth.isLoggedIn()) {
      console.log("guard failed");
      this.router.navigateByUrl('/');
      return false;
    }
    console.log("guard passed");
    return true;
  }
}

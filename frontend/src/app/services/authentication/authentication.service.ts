import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';
import { Token } from '@angular/compiler/src/ml_parser/lexer';

//interfaces go here

export interface TokenPayload {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  url = `http://httpbin.org/post`;

  constructor(private http: HttpClient, private router: Router) { }

  public register(user: TokenPayload) {
    this.http.post(this.url, user).toPromise()
    .then((data: any) => {
      console.log(JSON.stringify(data.json));
    })
    .catch(error => {
      console.log("error: " + error);
    })
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';
import { Token } from '@angular/compiler/src/ml_parser/lexer';

//interfaces go here

export interface TokenPayload {
  name: string;
  email: string;
  password: string;
}

export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  exp: number;
}

interface TokenResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private token: string;

  constructor(private http: HttpClient, private router: Router) { }

  private saveToken(token: string): void {
    localStorage.setItem('user-token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('user-token');
    }
    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  private request(type: 'login'|'register'|'profile', user: TokenPayload): Observable<any> {
    let base = this.http.post(`http://localhost:3000/users/${type}`, user);
  
    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        console.log(JSON.stringify(data));
        return data;
      },
      (error) => {
        //TODO: HANDLE REQUEST ERRORS (not sure how to do this properly)
      })
    );
  
    return request;
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request('login', user);
  }

  public register(user: TokenPayload): Observable<any> {
    return this.request('register', user);
  }
}

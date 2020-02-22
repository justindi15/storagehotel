import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';

//interfaces go here

export interface Address {
  line1: string;
  line2: string;
  city: string;
  postalcode: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  payment_method: any;
  address: Address;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  items: {
    name: string;
    path: string;
    status: string;
    price: number;
  }
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
    sessionStorage.setItem('user-token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = sessionStorage.getItem('user-token');
    }
    return this.token;
  }

  public logout(): void {
    sessionStorage.clear()
    this.token = null;
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
      console.log(user);
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  private request(method: 'post'|'get', type: 'login'|'register'|'profile', user?: RegisterPayload | LoginPayload): Observable<any> {
    let base;

    if (method === 'post') {
      base = this.http.post(`http://localhost:3000/users/${type}`, user);
    } else {
      base = this.http.get(`http://localhost:3000/users/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
    }

    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      },
      (error) => {
        //TODO: HANDLE REQUEST ERRORS (not sure how to do this properly)
      })
    );

    return request;
  }

  public login(user: LoginPayload): Observable<any> {
    return this.request('post', 'login', user);
  }

  public register(user: RegisterPayload): Observable<any> {
    return this.request('post', 'register', user);
  }

  public profile(): Observable<any> {
    return this.request('get', 'profile');
  }

  public verifyEmail(email: string): Observable<any> {
    const postData = { email: email }
    return this.http.post(`http://localhost:3000/users/verifyEmail`, postData);
  }

  public resendActivationEmail(email: string): Observable<any> {
    const postData = { email: email }
    return this.http.post(`http://localhost:3000/users/resendEmail`, postData);
  }

  public activate(token: string, password: string): Observable<any> {
    const postData = {
      password: password,
      activationToken: token,
    }
    return this.http.post(`http://localhost:3000/users/activate`, postData);
  }

  public addAppointment(email: string, appointment: any): Observable<any> {
    const postData = {
      email: email,
      appointment: appointment
    }
    return this.http.post(`http://localhost:3000/users/appointment`, postData);
  }

  public deleteAppointment(email: string, appointmentId: string): Observable<any> {
    const postData = {
      email: email,
      appointmentId: appointmentId
    }
    console.log(postData);
    return this.http.post(`http://localhost:3000/users/deleteappointment`, postData);
  }
}

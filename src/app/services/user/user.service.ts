import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public token: string;
  public account: object;
  public url: string = "http://localhost:5637/users";

  constructor(private _httpClient: HttpClient) { }

  authenticate(user) {
    return this._httpClient.post(`${this.url}/authenticate`, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(catchError(this.errorHandler))
  }

  getProfile() {
    this.loadToken();
    return this._httpClient.get(`${this.url}/profile`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.token
      })
    })
      .pipe(catchError(this.errorHandler))
  }

  loadToken() {
    const token = localStorage.getItem('token');
    this.token = token;
  }

  storeUserData(token, account) {
    localStorage.setItem('token', token);
    localStorage.setItem('account', JSON.stringify(account));

    this.token = token;
    this.account = account;
  }

  loggedIn() {
    if (localStorage.token != null) {
      return true;
    } else {
      const helper = new JwtHelperService();

      return !helper.isTokenExpired(localStorage.token);
    }
  }

  adminLoggedIn() {
    let account = JSON.parse(localStorage.getItem('account'));

    if (localStorage.token != null) {
      if (account["userType"] == "administrator") {
        return true;
      } else {
        return false;
      }
    } else {
      const helper = new JwtHelperService();

      return !helper.isTokenExpired(localStorage.token);
    }
  }

  logOut() {
    this.token = null;
    this.account = null;

    localStorage.clear();
  }

  errorHandler(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.error('Client Side Error:', errorResponse.error.message);
    } else {
      console.log('Server Side Error: ', errorResponse);
    }
    return throwError('There is a problem with the service. We\'re notified & working on it. Please try again later.');
  }
}

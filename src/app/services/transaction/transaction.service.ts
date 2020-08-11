import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ITransaction } from "../../interfaces/ITransaction";
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  public token: string;
  public url: string = "http://localhost:5637"

  constructor(private _httpClient: HttpClient) { }

  getTransaction(): Observable<ITransaction[]> {
    this.loadToken();
    return this._httpClient.get<ITransaction[]>(`${this.url}/transaction`, {
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

  addTransaction(trans): Observable<ITransaction[]> {
    return this._httpClient.post<ITransaction[]>(`${this.url}/transaction`, trans, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(catchError(this.errorHandler))
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

